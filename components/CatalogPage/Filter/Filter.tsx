'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';
import './Filter.scss';

import { FilterApplyFN, FilterData, FilterFetchData } from './interface';
import axios from 'axios';

import Dropdown from '../../Shared/Dropdown/Dropdown';
import OverflowContainer from '../../Shared/OverflowContainer/OverflowContainer';

import { declOfNum } from '../../../utils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { FilterSkeleton } from '../../skeletons/skeletons';

import { ModalWrapper } from '../../CentralModal/CenterModal';
import { HydrationComponent } from '../../ProductPage/ProductPage';
import { centerModalControl } from '../../../store';

import type { FilterParameters } from './interface';
import InputFilter from './InputFilter/InputFilter';
import CheckboxFilter from './CheckboxFilter/CheckboxFilter';

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

const useInitialState = (): [boolean, () => void] => {
	const firstRender = useRef<boolean>(false);
	return [
		firstRender.current,
		() => {
			firstRender.current = true;
		},
	];
};

function FacetFilter({ initialFilters }: { initialFilters: FilterFetchData }): JSX.Element {
	const router = useRouter();

	const { maincategory, category } = useParams();
	const searchParams = new URLSearchParams(useSearchParams());
	const pathname = usePathname();

	let url = '/api/products/filters/';
	if (maincategory) url += `${maincategory}/`;
	if (category) url += `${category}/`;

	const getActiveFilters = getFilterParameters(searchParams);
	const getActiveFiltersLength = Object.keys(getActiveFilters).length;

	const FoundedItemsButton = ({ count, onClick }: { count: number; onClick?: (...args: any[]) => void }): JSX.Element => {
		if (count === 0) {
			return (
				<button className={'filter__founded__items__button filter__founded__items__button__empty filter__modal__button'}>Пустой результат</button>
			);
		}
		return (
			<button
				className="filter__founded__items__button filter__modal__button"
				onClick={() => {
					if (onClick) onClick();
					window.scrollTo({
						behavior: 'smooth',
						top: 0,
						left: 0,
					});
					router.push(pathname + '?' + searchParams.toString());
				}}
			>
				Показать {count} {declOfNum(count, ['товар', 'товара', 'товаров'])}
			</button>
		);
	};

	const ClearFiltersButton = ({ onClick }: { onClick?: () => void }): JSX.Element => {
		return (
			<button
				className="filter__clear__button filter__modal__button"
				onClick={() => {
					window.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
					searchParams.delete('filter');
					router.push(pathname + '?' + searchParams.toString());
					if (onClick) onClick();
				}}
			>
				Очистить фильтры
			</button>
		);
	};

	const AllFilterComponent = ({
		filterData,
		currentFilterQuery,
	}: {
		filterData: { count: number; filtered: FilterData };
		currentFilterQuery: string | undefined;
	}): JSX.Element => {
		const [FilterData, setFilterData] = useState<{ count: number; filtered: FilterData }>(filterData);
		const router = useRouter();

		const searchParams = new URLSearchParams(useSearchParams());
		const pathname = usePathname();

		const currenFilter = useRef<string>(currentFilterQuery ?? '');
		const randomKey = useRef<string>('');

		const filtersCount = Object.keys(initialFilters?.filtered ?? {}).length;
		const itemsPerColumn = Math.ceil(filtersCount / 3);

		const fetchData = (searchParams: string) => {
			axios({
				method: 'GET',
				url: url + searchParams,
			}).then((response) => {
				setFilterData(response.data);
			});
		};

		const Close = (): void => {
			if (currenFilter.current !== '') {
				searchParams.set('filter', currenFilter.current);
			}
			setFilterData({ ...filterData });
		};

		return createPortal(
			<ModalWrapper>
				<div className="filter__modal__content">
					<div className="filter__modal__content__header">
						<div className="content__header__wrapper">
							<h3 className="filter__modal__content__header">Все фильтры</h3>
							<p className="filters__modal__count">
								всего {filtersCount} {declOfNum(filtersCount, ['параметр', 'параметра', 'параметров'])}
							</p>
						</div>
						<div className="filter__modal__close__wrapper">
							<button className="filter__modal__close__wrapper__button" onClick={() => centerModalControl.toggle()}>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</div>
					</div>
					<hr className="break__line__standard"></hr>
					<div className="filter__modal__content__items__wrapper">
						<div className="filter__modal__content__items" key={randomKey.current}>
							{[1, 2, 3].map((column) => {
								const start = itemsPerColumn * (column - 1);
								const end = itemsPerColumn * column;
								return (
									<div className="filter__column" key={`filter-column-${column}`}>
										{Object.entries(FilterData?.filtered ?? {})
											.slice(start, end)
											.map(([parentKey, parentValue]) => {
												const DropdownHeader = <span className="dropdown__label">{parentValue.name}</span>;
												return (
													<Dropdown header={DropdownHeader} key={'modal-filter-' + parentKey}>
														<OverflowContainer maxHeight={290}>
															{parentValue.valueType === 'string' ? (
																<CheckboxFilter
																	config={{
																		parentKey: parentKey,
																		filterData: parentValue,
																		applyFilter: FilterApplyFN.UPDATE,
																		callback: fetchData,
																		router: router,
																		ActiveFilters: getActiveFilters,
																		searchParams: searchParams,
																		path: pathname,
																	}}
																/>
															) : (
																<InputFilter
																	config={{
																		parentKey: parentKey,
																		filterData: parentValue,
																		applyFilter: FilterApplyFN.UPDATE,
																		callback: fetchData,
																		router: router,
																		ActiveFilters: getActiveFilters,
																		searchParams: searchParams,
																		path: pathname,
																	}}
																/>
															)}
														</OverflowContainer>
													</Dropdown>
												);
											})}
									</div>
								);
							})}
						</div>
					</div>
					<div className="filter__modal__footer__items">
						<button className="filter__modal__return__button filter__modal__button" onClick={Close}>
							Возрат
						</button>
						<FoundedItemsButton count={FilterData?.count ?? 0} onClick={() => centerModalControl.toggle()} />
						<ClearFiltersButton onClick={() => centerModalControl.toggle()} />
					</div>
				</div>
			</ModalWrapper>,
			document.body,
		);
	};

	//FilterSkeleton
	return (
		<>
			<div>
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
													ActiveFilters: getActiveFilters,
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
													ActiveFilters: getActiveFilters,
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

				<button
					className="filter__show__all"
					onClick={() => {
						centerModalControl.toggle();
					}}
				>
					Показать все фильтры
				</button>
				<HydrationComponent>
					<AllFilterComponent filterData={initialFilters} currentFilterQuery={searchParams.get('filter') ?? ''} />
				</HydrationComponent>
				{/* {FilterCount > 10 ? <AllFilterComponent filterData={filters} /> : ''} */}
				{getActiveFiltersLength > 0 ? <ClearFiltersButton /> : ''}
			</div>
		</>
	);
}

export { getFilterParameters, collectFilterParameters };
export type { FilterFetchData };
export default FacetFilter;
