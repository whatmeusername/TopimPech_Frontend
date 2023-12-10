'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import './Filter.scss';

import { FacetType, FilterApplyFN, FilterFetchData, FilterItemNumber, FilterItemObject } from './interface';

import Dropdown from '../../Shared/Dropdown/Dropdown';
import OverflowContainer from '../../Shared/OverflowContainer/OverflowContainer';

import { FilterSkeleton } from '../../skeletons/skeletons';

import { HydrationComponent } from '../../ProductPage/ProductPage';
import { centerModalControl } from '../../../store';

import type { FilterParameters, SearchParamsFilterQueryResult } from './interface';
import CheckboxFilter from './CheckboxFilter/CheckboxFilter';
import { AllFilterComponent, ClearFiltersButton } from './AllFilterComponent/AllFilterComponent';
import { ReactElement, useEffect, useRef } from 'react';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { FilterIcon } from '../../IconsElements';
import { Capitalize } from '../../../utils/Capitalize';
import { RangeFilter } from './RangeFilter/RangeFilter';
import { IsSearchParamsFilterQueryNumberResult, IsSearchParamsFilterQueryStringResult } from './AppliedFiltersElement/AppliedFiltersElement';
import { useFilterParam } from '../../../hooks/useFilterParam';
import { useFilterPathname } from '../../../hooks/useFilterPathname';

const getFilterParameters = (searchParams: URLSearchParams | ParsedUrlQuery, appliedFilters: SearchParamsFilterQueryResult): FilterParameters => {
	let filterParam: string | null;
	if (searchParams instanceof URLSearchParams) filterParam = searchParams.get('filter');
	else filterParam = searchParams['filter'] as string;

	const filters: { [K: string]: string[] } = {};
	if (filterParam === null || filterParam === '' || filterParam === undefined) {
		const entries = Object.entries(appliedFilters);
		if (entries.length === 0) return filters;
		else {
			for (let i = 0; i < entries.length; i++) {
				const [key, value] = entries[i];
				if (IsSearchParamsFilterQueryStringResult(value)) {
					filters[key] = value.values;
				} else if (IsSearchParamsFilterQueryNumberResult(value)) {
					filters[key] = [value.min?.toString() ?? '', value.max?.toString() ?? ''];
				}
			}
		}
	} else {
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

const AllFiltersOpenButton = ({ shortLabel, filterCount }: { shortLabel?: boolean; filterCount?: number }): ReactElement => {
	return (
		<button
			className="filter__show__all"
			onClick={() => {
				centerModalControl.toggle('FilterModal');
			}}
		>
			<FilterIcon className="filter__show__all__icon" />
			<p className="filter__show__all__label"> {shortLabel ? 'Фильтры' : 'Показать все фильтры'}</p>
			{filterCount ? <span className="filter__show__all__count">({filterCount})</span> : null}
		</button>
	);
};

//eslint-disable-next-line
function StickyScroll({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
	const stickyUpperPoint = useRef<HTMLSpanElement>(null!);
	const stickyrBottomPoint = useRef<HTMLSpanElement>(null!);
	const stickyWrapper = useRef<HTMLDivElement>(null!);
	const scrollDirection = useRef<1 | 0 | -1>(1);

	useEffect(() => {
		const scrollEvent = () => {
			const bottomY = window.scrollY + window.innerHeight;
			const contentBottom = stickyWrapper.current.offsetHeight + stickyWrapper.current.offsetTop;
			if (bottomY >= contentBottom && scrollDirection.current !== -1) {
				scrollDirection.current = -1;
				const rect = stickyWrapper.current.getBoundingClientRect();
				stickyWrapper.current.style.top = `${rect.y < 0 ? rect.y : 75}px`;
				stickyWrapper.current.style.position = 'sticky';
				window.removeEventListener('scroll', scrollEvent);
			}
		};
		window.addEventListener('scroll', scrollEvent);
		return () => window.removeEventListener('scroll', scrollEvent);
	}, []);

	return (
		<div className="sticky__scroll__element__wrapper">
			<span className="sticky__scroll__element__upper__point" ref={stickyUpperPoint} />
			<div className="sticky__scroll__element__content" ref={stickyWrapper}>
				{children}
			</div>
			<span className="sticky__scroll__element__bottom__point" ref={stickyrBottomPoint} />
		</div>
	);
}

function FacetFilter({ initialFilters }: { initialFilters: FilterFetchData }): ReactElement {
	const router = useRouter();

	const isMobile = useMobile(1024);

	const searchParams = new URLSearchParams(useSearchParams() as any);

	const category = useFilterParam(initialFilters);
	const pathname = useFilterPathname(initialFilters);

	const ActiveFilters = getFilterParameters(searchParams, initialFilters.appliedFilters);

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
									const DropdownHeader = (
										<span className="dropdown__label">
											{Capitalize(parentValue.other.label)}
											{parentValue.other.unit ? `, ${parentValue.other.unit}` : ''}
										</span>
									);

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
													<RangeFilter
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
					{FilterCount > 10 ? <AllFiltersOpenButton filterCount={FilterCount} /> : null}
					{getActiveFiltersLength > 0 ? <ClearFiltersButton /> : null}
				</div>
			) : null}
			{isMobile || FilterCount > 10 ? (
				<HydrationComponent>
					<AllFilterComponent
						filterData={initialFilters}
						currentFilterQuery={searchParams.get('filter') ?? ''}
						ActiveFilters={ActiveFilters}
						initialFilters={initialFilters}
						fetchURL={`/api/products/filters/${category ?? ''}`}
					/>
				</HydrationComponent>
			) : null}
		</>
	);
}

export { getFilterParameters, collectFilterParameters, AllFiltersOpenButton, useFilterPathname };
export type { FilterFetchData };
export default FacetFilter;
