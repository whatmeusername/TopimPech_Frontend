'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import './Filter.scss';

import { FilterApplyFN, FilterFetchData } from './interface';

import Dropdown from '../../Shared/Dropdown/Dropdown';
import OverflowContainer from '../../Shared/OverflowContainer/OverflowContainer';

import { FilterSkeleton } from '../../skeletons/skeletons';

import { HydrationComponent } from '../../ProductPage/ProductPage';
import { centerModalControl } from '../../../store';

import type { FilterParameters } from './interface';
import InputFilter from './InputFilter/InputFilter';
import CheckboxFilter from './CheckboxFilter/CheckboxFilter';
import useWindowSize from '../../../hooks/useWindowSize';
import { AllFilterComponent, ClearFiltersButton } from './AllFilterComponent/AllFilterComponent';
import { ReactElement } from 'react';

const getFilterParameters = (searchParams: URLSearchParams | ParsedUrlQuery): FilterParameters => {
	let filterParam: string | null;
	if (searchParams instanceof URLSearchParams) filterParam = searchParams.get('filter');
	else filterParam = searchParams['filter'] as string;

	const filters: { [K: string]: string[] } = {};
	if (filterParam === null || filterParam === '' || filterParam === undefined) return filters;
	else {
		const rawFilters = filterParam.split(';');
		rawFilters.forEach((filter) => {
			const [key, value] = filter.split(':');
			if (value) filters[key] = value.split('$');
		});
	}
	return filters;
};

const collectFilterParameters = (filterParam: { [K: string]: string[] } | null): string => {
	let res = '';
	if (filterParam === null) return res;

	const filterLength = Object.keys(filterParam).length - 1;
	Object.entries(filterParam).forEach(([key, value], index) => {
		res += key + ':' + value.join('$');
		if (index !== filterLength) res += ';';
	});
	return res;
};

const AllFiltersOpenButton = ({ shortLabel }: { shortLabel?: boolean }): ReactElement => {
	return (
		<button
			className="filter__show__all"
			onClick={() => {
				centerModalControl.toggle();
			}}
		>
			{shortLabel ? 'Фильтры' : 'Показать все фильтры'}
		</button>
	);
};

function FacetFilter({ initialFilters }: { initialFilters: FilterFetchData }): JSX.Element {
	const router = useRouter();

	const { width } = useWindowSize();

	const { maincategory, category } = useParams();
	const searchParams = new URLSearchParams(useSearchParams());
	const pathname = usePathname();

	let fetchURL = '/api/products/filters/';
	if (maincategory) fetchURL += `${maincategory}/`;
	if (category) fetchURL += `${category}/`;

	const ActiveFilters = getFilterParameters(searchParams);
	const getActiveFiltersLength = Object.keys(ActiveFilters).length;
	const FilterCount = Object.keys(initialFilters?.filtered ?? {}).length;

	//FilterSkeleton
	return (
		<>
			{!width || width > 1024 ? (
				<>
					<div className="facet__filters__wrapper">
						{initialFilters?.filtered !== undefined ? (
							Object.entries(initialFilters?.filtered ?? {})
								.slice(0, 10)
								.map(([parentKey, parentValue]) => {
									const DropdownHeader = <span className="dropdown__label">{parentValue.name}</span>;
									return (
										<Dropdown header={DropdownHeader} key={'filter-' + parentKey}>
											<OverflowContainer maxHeight={290}>
												{parentValue.valueType === 'string' ? (
													<CheckboxFilter
														config={{
															parentKey: parentKey,
															filterData: parentValue,
															applyFilter: FilterApplyFN.APPLY,
															callback: undefined,
															router: router,
															ActiveFilters: ActiveFilters,
															searchParams: searchParams,
															path: pathname,
														}}
													/>
												) : (
													<InputFilter
														config={{
															parentKey: parentKey,
															filterData: parentValue,
															applyFilter: FilterApplyFN.APPLY,
															callback: undefined,
															router: router,
															ActiveFilters: ActiveFilters,
															searchParams: searchParams,
															path: pathname,
														}}
													/>
												)}
											</OverflowContainer>
										</Dropdown>
									);
								})
						) : (
							<FilterSkeleton />
						)}
					</div>
					{FilterCount > 10 ? <AllFiltersOpenButton /> : null}
					{getActiveFiltersLength > 0 ? <ClearFiltersButton router={router} searchParams={searchParams} pathname={pathname} /> : null}
				</>
			) : null}
			{(width && width <= 1024) || FilterCount > 10 ? (
				<HydrationComponent>
					<AllFilterComponent
						filterData={initialFilters}
						currentFilterQuery={searchParams.get('filter') ?? ''}
						ActiveFilters={ActiveFilters}
						initialFilters={initialFilters}
						fetchURL={fetchURL}
					/>
				</HydrationComponent>
			) : null}
		</>
	);
}

export { getFilterParameters, collectFilterParameters, AllFiltersOpenButton };
export type { FilterFetchData };
export default FacetFilter;
