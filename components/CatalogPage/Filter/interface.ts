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
	max: number;
	min: number;
	other: { label: string; unit?: string; description?: string };
	items: {
		value: string;
		count: number;
		other: { label: string; unit?: string; description?: string };
	}[];
}

interface FilterItemNumber {
	type: FacetType;
	value: string;
	max: number;
	min: number;
	other: { label: string; unit?: string; description?: string };
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
	callback?: (searchParams: URLSearchParams) => void;
	ActiveFilters: FilterParameters;
	router: AppRouterInstance;
	searchParams: URLSearchParams;
	path: string;
}

interface FilterElementConfigNumber extends Omit<FilterElementConfig, 'filterData'> {
	filterData: FilterItemNumber;
}

interface SearchParamsFilterQueryString {
	values: string[];
}
type SearchParamsFilterQueryNumber = { min: number; max?: number } | { min?: number; max: number };

interface GroupedByItemsResult {
	value: string;
	other: { [K: string]: any };
	count: number;
}
interface GroupedByItemsNumberResult {
	max: number;
	min: number;
	type: FacetType;
	value: string;
}

interface SearchParamsFilterQueryStringResult extends Omit<SearchParamsFilterQueryString, 'values'> {
	values: string[];
	value: string;
	type: FacetType;
	other: { [K: string]: any };
	items: GroupedByItemsResult[];
}

interface SearchParamsFilterQueryNumberResult extends Omit<SearchParamsFilterQueryNumber, 'min' | 'max'> {
	min?: number;
	max?: number;
	value: string;
	type: FacetType;
	other: { [K: string]: any };
	items: GroupedByItemsNumberResult;
}

type SearchParamsFilterQueryResult = {
	[K: string]: SearchParamsFilterQueryStringResult | SearchParamsFilterQueryNumberResult;
};

interface FilterFetchData {
	count: number;
	filtered: FacetFiltersData;
	category: string;
	appliedFilters: SearchParamsFilterQueryResult;
	categoryStringAdditions: { prefix: string; postfix: string };
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
	activeFilters: FilterParameters;
}

interface FilterElementActionConfigRange extends Omit<FilterElementActionConfig, 'event' | 'key'> {
	event: React.FocusEvent<HTMLInputElement>;
	side: RangeFilterSide;
	filterData: FilterItemNumber;
}

interface FilterElementRemoveConfig {
	key?: string;
	parentKey: string;
	router: AppRouterInstance;
	searchParams: URLSearchParams;
	path: string;
	activeFilters: FilterParameters;
	type: FacetType;
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
	SearchParamsFilterQueryResult,
	SearchParamsFilterQueryStringResult,
	SearchParamsFilterQueryNumberResult,
	FilterElementRemoveConfig,
};
