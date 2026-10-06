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

		expect(parseTags(docBlock).example).toBe("const value = {\n    nested: true,\n};");
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
});
