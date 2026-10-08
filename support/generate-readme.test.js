import { formatReadme, parseParamTag, parseTags, renderHelperDocs } from "./generate-readme.js";
import { describe, expect, test } from "vite-plus/test";

describe("formatReadme", () => {
	// The formatter runs as a separate process, which can take longer than the
	// default 5-second limit while the rest of the suite runs in parallel.
	test("Formats generated Markdown with the repository formatter", () => {
		const readme = ["# Test", "", "```js", "const items=[1,2]", "```", ""].join("\n");

		expect(formatReadme(readme)).toBe(
			["# Test", "", "```js", "const items = [1, 2];", "```", ""].join("\n"),
		);
	}, 20_000);
});

describe("parseTags", () => {
	test("should parse a single @param tag", () => {
		const docBlock = [
			"/**",
			" * @helper example",
			" * @param  {string}  needle",
			" *     The value to find.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).params).toEqual([
			{ type: "string", name: "needle", description: "The value to find." },
		]);
	});

	test("should preserve order across repeated @param tags", () => {
		const docBlock = [
			"/**",
			" * @param  {string}  readme",
			" *     The current README content.",
			" * @param  {string}  nextReadme",
			" *     The generated README content.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).params).toEqual([
			{ type: "string", name: "readme", description: "The current README content." },
			{ type: "string", name: "nextReadme", description: "The generated README content." },
		]);
	});

	test("should parse dotted options-object parameter names", () => {
		const docBlock = [
			"/**",
			" * @param  {string}  options.decoration",
			" *     The decoration to append when truncating.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).params).toEqual([
			{
				type: "string",
				name: "options.decoration",
				description: "The decoration to append when truncating.",
			},
		]);
	});

	test("should not append a trailing blank line to a param description", () => {
		const docBlock = [
			"/**",
			" * @param  {string}  needle",
			" *     The value to find.",
			" *",
			" * @note",
			" * Some note text.",
			" */",
		].join("\n");

		const docs = parseTags(docBlock);

		expect(docs.params).toEqual([
			{ type: "string", name: "needle", description: "The value to find." },
		]);

		expect(docs.note.trim()).toBe("Some note text.");
	});

	test("should return an empty params array when a helper has no @param tags", () => {
		const docBlock = [
			"/**",
			" * @helper example",
			" * @description",
			" * Does a thing.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).params).toEqual([]);
		expect(parseTags(docBlock).throws).toEqual([]);
		expect(parseTags(docBlock).examples).toEqual([]);
	});

	test("should preserve order and descriptions across repeated @throws tags", () => {
		const docBlock = [
			"/**",
			" * @throws  {TypeError}",
			" *     If the input is invalid.",
			" * @throws  {RangeError}",
			" *     If the number is outside the supported range.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).throws).toEqual([
			{ type: "TypeError", description: "If the input is invalid." },
			{ type: "RangeError", description: "If the number is outside the supported range." },
		]);
	});

	test("should parse a return type and description", () => {
		const docBlock = [
			"/**",
			" * @returns  {string | null}",
			" *     The matching value, or null when none exists.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).returns).toEqual({
			type: "string | null",
			description: "The matching value, or null when none exists.",
		});
	});

	test("should keep braces in descriptions on the type line", () => {
		const docBlock = [
			"/**",
			" * @returns  {object} Like { value: 1 }.",
			" * @throws  {TypeError} If { value } is missing.",
			" */",
		].join("\n");

		const docs = parseTags(docBlock);

		expect(docs.returns).toEqual({ type: "object", description: "Like { value: 1 }." });
		expect(docs.throws).toEqual([{ type: "TypeError", description: "If { value } is missing." }]);
	});

	test("should keep nested braces in an object return type", () => {
		const docBlock = [
			"/**",
			" * @returns  {{ text: string, index: number }}",
			" *     The truncated text and where it stopped.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).returns).toEqual({
			type: "{ text: string, index: number }",
			description: "The truncated text and where it stopped.",
		});
	});

	test("should keep descriptions when return and exception tags have no type", () => {
		const docBlock = [
			"/**",
			" * @returns The result.",
			" * @throws If the input is invalid.",
			" */",
		].join("\n");

		const docs = parseTags(docBlock);

		expect(docs.returns).toEqual({ type: "", description: "The result." });
		expect(docs.throws).toEqual([{ type: "", description: "If the input is invalid." }]);
	});

	test("should keep indented note paragraphs as prose", () => {
		const docBlock = [
			"/**",
			" * @note",
			" *     The first paragraph stays prose.",
			" *",
			" *     The second paragraph stays prose.",
			" */",
		].join("\n");

		expect(parseTags(docBlock).note).toBe(
			"The first paragraph stays prose.\n\nThe second paragraph stays prose.",
		);
	});

	test("should keep extra indentation in examples", () => {
		const docBlock = [
			"/**",
			" * @example",
			" *     const value = {",
			" *         nested: true,",
			" *     };",
			" */",
		].join("\n");

		expect(parseTags(docBlock).examples).toEqual(["const value = {\n    nested: true,\n};"]);
	});

	test("should preserve order and Markdown indentation across repeated @example tags", () => {
		const docBlock = [
			"/**",
			" * @example",
			" *     const first = {",
			" *         nested: true,",
			" *     };",
			" * @example",
			" *     const second = 2;",
			" *",
			" *     console.log(second);",
			" */",
		].join("\n");

		expect(parseTags(docBlock).examples).toEqual([
			"const first = {\n    nested: true,\n};",
			"const second = 2;\n\nconsole.log(second);",
		]);
	});
});

describe("parseParamTag", () => {
	test("should split a {type} name header into its parts", () => {
		expect(parseParamTag("{number}  length")).toEqual({
			type: "number",
			name: "length",
			description: "",
		});
	});
});

describe("renderHelperDocs", () => {
	test("should render a Parameters section from parsed @param tags", () => {
		const docs = {
			signature: "example(needle: string)",
			description: "Find a needle.",
			params: [{ type: "string", name: "needle", description: "The value to find." }],
		};

		expect(renderHelperDocs(docs)).toContain(
			"#### Parameters\n\n- `needle` `{string}` — The value to find.",
		);
	});

	test("should omit the Parameters section when there are no params", () => {
		const docs = {
			signature: "example()",
			description: "Do a thing.",
			params: [],
		};

		expect(renderHelperDocs(docs)).not.toContain("#### Parameters");
	});

	test("should render every example in source order", () => {
		const docs = {
			signature: "example()",
			description: "Do a thing.",
			params: [],
			examples: ["const first = 1;", "const second = 2;"],
		};

		expect(renderHelperDocs(docs)).toContain(
			"#### Examples\n\n```js\nconst first = 1;\n```\n\n```js\nconst second = 2;\n```",
		);
	});

	test("should keep the singular heading for one example", () => {
		const docs = {
			signature: "example()",
			description: "Do a thing.",
			params: [],
			examples: ["const result = example();"],
		};

		expect(renderHelperDocs(docs)).toContain(
			"#### Example\n\n```js\nconst result = example();\n```",
		);
	});

	test("should skip empty examples", () => {
		const docs = {
			signature: "example()",
			description: "Do a thing.",
			params: [],
			examples: ["", "const result = example();"],
		};

		expect(renderHelperDocs(docs)).toContain(
			"#### Example\n\n```js\nconst result = example();\n```",
		);

		expect(renderHelperDocs(docs)).not.toContain("```js\n\n```");
	});

	test("should render typed and untyped return and exception descriptions", () => {
		const docs = {
			signature: "example()",
			description: "Do a thing.",
			params: [],
			returns: { type: "string", description: "The result." },
			throws: [
				{ type: "TypeError", description: "If the input is invalid." },
				{ type: "", description: "If the operation fails." },
			],
		};

		expect(renderHelperDocs(docs)).toContain("#### Returns\n\n`{string}` — The result.");

		expect(renderHelperDocs(docs)).toContain(
			"#### Throws\n\n- `{TypeError}` — If the input is invalid.\n- If the operation fails.",
		);
	});

	test("should render parsed JSDoc in the reference section order", () => {
		const docBlock = [
			"/**",
			" * @signature example(value)",
			" * @description",
			" *     Do a thing.",
			" * @param  {number}  value",
			" *     The input value.",
			" * @returns  {number}",
			" *     The result.",
			" * @throws  {TypeError}",
			" *     If the input has the wrong type.",
			" * @throws  {RangeError}",
			" *     If the input is too large.",
			" * @note",
			" *     Results are stable.",
			" * @example",
			" *     example(1);",
			" * @example",
			" *     example(2);",
			" */",
		].join("\n");

		expect(renderHelperDocs(parseTags(docBlock))).toBe(
			[
				"### `example(value)`",
				"Do a thing.",
				"#### Parameters\n\n- `value` `{number}` — The input value.",
				"#### Returns\n\n`{number}` — The result.",
				"#### Throws\n\n- `{TypeError}` — If the input has the wrong type.\n- `{RangeError}` — If the input is too large.",
				"Results are stable.",
				"#### Examples\n\n```js\nexample(1);\n```\n\n```js\nexample(2);\n```",
			].join("\n\n"),
		);
	});
});
