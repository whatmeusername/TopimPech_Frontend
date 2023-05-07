import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import type { NextRouter } from 'next/router';

enum FilterApplyFN {
	APPLY = 'apply',
	UPDATE = 'update',
}

enum RangeFilterSide {
	MIN = 'min',
	MAX = 'max',
}

interface FilterItem {
	valueType: 'number' | 'string';
	name: string;
	values: { [K: string]: { items: number; name: string } };
}
interface FilterData {
	[K: string]: FilterItem;
}

interface FilterParameters {
	[K: string]: any[];
}

interface FilterElementConfig {
	parentKey: string;
	filterData: FilterItem;
	applyFilter: FilterApplyFN;
	callback?: (...args: any[]) => void;
	ActiveFilters: FilterParameters;
	router: AppRouterInstance;
	searchParams: URLSearchParams;
	path: string;
}

interface FilterFetchData {
	count: number;
	filtered: FilterData;
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
	filterData: FilterItem;
}

export { FilterApplyFN, RangeFilterSide };
export type {
	FilterItem,
	FilterData,
	FilterParameters,
	FilterElementConfig,
	FilterFetchData,
	FilterElementActionConfig,
	FilterElementActionConfigRange,
};
