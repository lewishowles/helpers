export declare function getSearchParameter(
	search: string | URLSearchParams,
	parameter: string,
): string | null;
export declare function getUrlParameter(parameter: string): string | null;
export declare function removeSearchParameter(
	search: string | URLSearchParams,
	parameter: string,
): string;
export declare function removeUrlParameter(parameter: string): void;
export declare function updateSearchParameter(
	search: string | URLSearchParams,
	parameter: string,
	value: string | null,
): string;
export declare function updateUrlParameter(parameter: string, value: string | null): void;
