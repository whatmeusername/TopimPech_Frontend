'use client';

import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import './Filter.scss';

import { FacetType, FilterApplyFN, FilterFetchData, FilterItemNumber, FilterItemObject } from './interface';

import Dropdown from '../../Shared/Dropdown/Dropdown';
import OverflowContainer from '../../Shared/OverflowContainer/OverflowContainer';

import { FilterSkeleton } from '../../skeletons/skeletons';

import { HydrationComponent } from '../../ProductPage/ProductPage';
import { centerModalControl } from '../../../store';

import type { FilterParameters } from './interface';
import InputFilter from './InputFilter/InputFilter';
import CheckboxFilter from './CheckboxFilter/CheckboxFilter';
import { AllFilterComponent, ClearFiltersButton } from './AllFilterComponent/AllFilterComponent';
import { ReactElement } from 'react';
import { useMobile } from '../../../context/MobileContext/MobileContext';

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
				centerModalControl.toggle('FilterModal');
			}}
		>
			<p className="filter__show__all__label"> {shortLabel ? 'Фильтры' : 'Показать все фильтры'}</p>
		</button>
	);
};

function FacetFilter({ initialFilters }: { initialFilters: FilterFetchData }): JSX.Element {
	const router = useRouter();

	const isMobile = useMobile(1024);

	const { category } = useParams();
	const searchParams = new URLSearchParams(useSearchParams());
	const pathname = usePathname();

	const ActiveFilters = getFilterParameters(searchParams);
	const getActiveFiltersLength = Object.keys(ActiveFilters).length;
	const FilterCount = Object.keys(initialFilters?.filtered ?? {}).length;

	return (
		<>
			{!isMobile ? (
				<div className="facet__filters__container">
					<div className="facet__filters__wrapper">
						{initialFilters?.filtered !== undefined ? (
							Object.entries(initialFilters?.filtered ?? {})
								.slice(0, 10)
								.map(([parentKey, parentValue]) => {
									const DropdownHeader = <span className="dropdown__label">{parentValue.label}</span>;

									return (
										<Dropdown header={DropdownHeader} key={'filter-' + parentKey}>
											<OverflowContainer maxHeight={290}>
												{parentValue.type === FacetType.OBJECT ? (
													<CheckboxFilter
														config={{
															parentKey: parentKey,
															filterData: parentValue as FilterItemObject,
															applyFilter: FilterApplyFN.APPLY,
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
															filterData: parentValue as FilterItemNumber,
															applyFilter: FilterApplyFN.APPLY,
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
				</div>
			) : null}
			{isMobile || FilterCount > 10 ? (
				<HydrationComponent>
					<AllFilterComponent
						filterData={initialFilters}
						currentFilterQuery={searchParams.get('filter') ?? ''}
						ActiveFilters={ActiveFilters}
						initialFilters={initialFilters}
						fetchURL={`/api/products/filters/${category}`}
					/>
				</HydrationComponent>
			) : null}
		</>
	);
}

export { getFilterParameters, collectFilterParameters, AllFiltersOpenButton };
export type { FilterFetchData };
export default FacetFilter;
