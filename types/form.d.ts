type ValidationFunction = (
	value: any,
	formData: Record<string, any>,
) => boolean | string | string[];

type ValidationRule =
	| { rule: "required"; message: string }
	| { rule: "email"; message: string }
	| { rule: "size"; size: number; message: string }
	| { rule: "min"; min: number; message: string }
	| { rule: "max"; max: number; message: string }
	| { rule: "between"; min: number; max: number; message: string }
	| { rule: "in"; options: any[]; message: string }
	| { rule: "not_in"; options: any[]; message: string }
	| { rule: "regexp"; regexp: RegExp; message: string }
	| {
			rule: "custom";
			validate: (value: any, formData: Record<string, any>) => boolean;
			message: string;
	  }
	| { rule: "required_if"; field: string; value?: any; message: string }
	| { rule: "same"; field: string; message: string }
	| { rule: "different"; field: string; message: string };

export interface ValidationResult {
	errors: string[];
	valid: boolean;
	validated: boolean;
}

export declare function validateField(
	fieldName: string,
	validationRules: (ValidationRule | ValidationFunction)[],
	formData: Record<string, any>,
): ValidationResult;

export declare function validateForm(
	fields: Record<string, (ValidationRule | ValidationFunction)[]>,
	formData: Record<string, any>,
): {
	valid: boolean;
	validated: boolean;
	results: Record<string, ValidationResult>;
};
