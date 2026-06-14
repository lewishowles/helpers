type ValidationRule =
	| { rule: "required"; message: string }
	| { rule: "email"; message: string }
	| { rule: "size"; size: number; message: string }
	| { rule: "min"; min: number; message: string }
	| { rule: "max"; max: number; message: string }
	| { rule: "between"; min: number; max: number; message: string }
	| { rule: "in"; options: any[]; message: string }
	| { rule: "not_in"; options: any[]; message: string }
	| { rule: "regexp"; regexp: RegExp; message: string };

export declare function validateField(
	fieldName: string,
	validationRules: ValidationRule[],
	formData: Record<string, any>,
): true | string[];
