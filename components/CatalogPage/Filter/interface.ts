import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

enum FilterApplyFN {
	APPLY = 'apply',
	UPDATE = 'update',
}

enum RangeFilterSide {
	MIN = 'min',
	MAX = 'max',
}

enum FacetType {
	OBJECT = 'object',
	NUMBER = 'number',
}

interface FilterItemObject {
	type: FacetType;
	value: string;
	label: string;
	max: number;
	min: number;
	items: {
		value: string;
		label?: string | null;
		count: number;
	}[];
}

interface FilterItemNumber {
	type: FacetType;
	value: string;
	label: string;
	max: number;
	min: number;
}

interface FacetFiltersData {
	[K: string]: FilterItemObject | FilterItemNumber;
}

interface FilterParameters {
	[K: string]: any[];
}

interface FilterElementConfig {
	parentKey: string;
	filterData: FilterItemObject;
	applyFilter: FilterApplyFN;
	callback?: (...args: any[]) => void;
	ActiveFilters: FilterParameters;
	router: AppRouterInstance;
	searchParams: URLSearchParams;
	path: string;
}

interface FilterElementConfigNumber extends Omit<FilterElementConfig, 'filterData'> {
	filterData: FilterItemNumber;
}

interface FilterFetchData {
	count: number;
	filtered: FacetFiltersData;
}

interface FilterElementActionConfig {
	event: React.MouseEvent<HTMLInputElement>;
	key: string;
	parentKey: string;
	router: AppRouterInstance;
	applyFunction: FilterApplyFN;
	callback?: (...args: any[]) => void;
	searchParams: URLSearchParams;
	path: string;
}

interface FilterElementActionConfigRange extends Omit<FilterElementActionConfig, 'event' | 'key'> {
	event: React.FocusEvent<HTMLInputElement>;
	side: RangeFilterSide;
	filterData: FilterItemNumber;
}

export { FilterApplyFN, RangeFilterSide, FacetType };
export type {
	FilterParameters,
	FilterElementConfig,
	FilterFetchData,
	FilterElementActionConfig,
	FilterElementActionConfigRange,
	FilterItemObject,
	FilterItemNumber,
	FacetFiltersData,
	FilterElementConfigNumber,
};
