import type { Temporal } from "temporal-polyfill";

export interface DateParts {
	year: number;
	month: number;
	day: number;
}

export type DatePartInput = Partial<Record<keyof DateParts, number | string | null | undefined>>;

export type DateHelperInput =
	| Date
	| number
	| string
	| DateParts
	| Temporal.Instant
	| Temporal.PlainDate
	| Temporal.PlainDateTime
	| Temporal.ZonedDateTime;

export type MaybeDateHelperInput = DateHelperInput | null | undefined;

export type DateHelperValue =
	| Temporal.Instant
	| Temporal.PlainDate
	| Temporal.PlainDateTime
	| Temporal.ZonedDateTime;

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

export type DateHelperUnit = "day" | "week" | "month" | "year";

export declare function configureDateHelpers(config?: DateHelperOptions): DateHelperConfig;
export declare function getDateHelpersConfig(): DateHelperConfig;
export declare function parseDate(
	value: MaybeDateHelperInput,
	options?: DateHelperOptions,
): DateHelperValue | null;
export declare function addToDate(
	value: MaybeDateHelperInput,
	amount: number,
	unit: DateHelperUnit,
	options?: DateHelperOptions,
): DateHelperValue | null;
export declare function getDateParts(
	value: MaybeDateHelperInput,
	options?: DateHelperOptions,
): DateParts | null;
export declare function hasDateParts(parts: DatePartInput | null | undefined): boolean;
export declare function toDateFromParts(parts: DatePartInput): Temporal.PlainDate | null;
export declare function toEpochMilliseconds(
	value: MaybeDateHelperInput,
	options?: DateHelperOptions,
): number | null;
export declare function formatDate(
	value: MaybeDateHelperInput,
	format?: DateHelperFormat,
	options?: DateHelperOptions,
): string | null;
export declare function getRelativeDateParts(
	value: MaybeDateHelperInput,
	relativeTo?: MaybeDateHelperInput,
	options?: DateHelperOptions,
): RelativeDateParts | null;
export declare function formatRelativeDate(
	value: MaybeDateHelperInput,
	relativeTo?: MaybeDateHelperInput,
	options?: DateHelperOptions,
): string | null;
