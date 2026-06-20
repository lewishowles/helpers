export declare function getCurrentUrlParameter(parameter: string): string | null;
export declare function getSearchParameter(
	search: string | URLSearchParams,
	parameter: string,
): string | null;
export declare function removeCurrentUrlParameter(parameter: string): void;
export declare function removeSearchParameter(
	search: string | URLSearchParams,
	parameter: string,
): string;
export declare function updateCurrentUrlParameter(parameter: string, value: string | null): void;
export declare function updateSearchParameter(
	search: string | URLSearchParams,
	parameter: string,
	value: string | null,
): string;
