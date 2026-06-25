export type DateHelperFormat = Intl.DateTimeFormatOptions | string;

export interface DateHelperConfig {
	locale: string;
	timeZone: string;
	inputFormat: string;
	defaultFormat: string;
	formats: Record<string, DateHelperFormat>;
}

export type DateHelperOptions = Partial<Omit<DateHelperConfig, "formats">> & {
	formats?: Record<string, DateHelperFormat>;
};

export declare function configureDateHelpers(config?: DateHelperOptions): DateHelperConfig;
