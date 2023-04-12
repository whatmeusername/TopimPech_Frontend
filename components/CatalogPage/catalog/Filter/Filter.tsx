import { useState, useEffect, useRef } from 'react';
import { useRouter, NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import './filter.scss';

import type { FilterData, FilterItem } from './interface';
import axios from 'axios';

import Dropdown from '../../../Dropdown/Dropdown';
import OverflowContainer from '../../../OverflowContainer/OverflowContainer';

import { SearchParamsBuilder } from '../catalog';

import useToggle from '../../../../hooks/useToggle';
import { declOfNum } from '../../../../utils/';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { FilterSkeleton } from '../../../skeletons/skeletons';

const getFilterParameters = (searchParams: URLSearchParams | ParsedUrlQuery) => {
	let filterParam: string | null;
	if (searchParams instanceof URLSearchParams) filterParam = searchParams.get('filter');
	else filterParam = searchParams['filter'] as string;

	let filters: { [K: string]: string[] } = {};
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

const filterOnCheck = (
	event: React.MouseEvent,
	key: string,
	parentKey: string,
	router: NextRouter,
	apply: 'update' | 'apply',
	callback: (...args: any[]) => void,
) => {
	const searchParams = router.query;

	let checked = (event.target as HTMLInputElement).checked;
	const filtersParams = getFilterParameters(searchParams);

	if (checked) {
		let currentValue = filtersParams[parentKey];
		if (!currentValue) {
			filtersParams[parentKey] = [key];
		} else {
			if (!currentValue.includes(key)) filtersParams[parentKey].push(key);
		}
	} else {
		let currentValue = filtersParams[parentKey];
		if (currentValue) {
			let valueIndex = currentValue.findIndex((item) => item === key);
			filtersParams[parentKey].splice(valueIndex, 1);
			if (currentValue.length === 0) {
				delete filtersParams[parentKey];
			}
		}
	}

	let filtersParamsLength = Object.keys(filtersParams).length;
	let searchParamsSTR = collectFilterParameters(filtersParams);

	if (filtersParamsLength > 0) {
		searchParams['filter'] = searchParamsSTR;
	} else delete searchParams['filter'];

	if (apply === 'apply') {
		searchParams['page'] = '1';
		router.push({ pathname: router.pathname, query: searchParams }, undefined, { scroll: false });
	} else if (apply === 'update') {
		callback(`?filter=${searchParamsSTR}`);
	}
};

const filterOnInput = (
	event: React.FocusEvent<HTMLInputElement>,
	side: 'min' | 'max',
	parentKey: string,
	filterData: FilterItem,
	router: NextRouter,
	apply: 'apply' | 'update',
	callback: (...args: any[]) => void,
) => {
	const searchParams = router.query;
	const filtersParams = getFilterParameters(searchParams);
	let value = (event.target as HTMLInputElement).value;

	const applyFilter = () => {
		let filtersCount = Object.keys(filtersParams).length;
		if (apply === 'apply') {
			if (filtersCount === 0) {
				delete searchParams['filter'];
			}
			searchParams['page'] = '1';
			router.push({ pathname: router.pathname, query: searchParams }, undefined, { scroll: false });
		} else if (apply === 'update') {
			callback(filtersCount !== 0 ? `?filter=${searchParams['filter']}` : '');
		}
	};

	let currentFilter = filtersParams[parentKey] ?? ['', ''];

	let valueAsFloat = parseFloat(parseFloat(value.replaceAll(',', '.')).toFixed(2));
	let valueIsNumber = !isNaN(valueAsFloat);

	if ((side === 'min' && value !== currentFilter[0]) || (side === 'max' && value !== currentFilter[1])) {
		if (value === '') {
			if (side === 'min') currentFilter[0] = '';
			else if (side === 'max') currentFilter[1] = '';

			if (currentFilter[0] === '' && currentFilter[1] === '') {
				delete filtersParams[parentKey];
			}

			let search = collectFilterParameters(filtersParams);
			searchParams['filter'] = search;

			applyFilter();
		} else if (valueIsNumber && valueAsFloat > 0) {
			let filterMin = filterData.values.min as unknown as number;
			let filterMax = filterData.values.max as unknown as number;

			if (side === 'min') {
				if (valueAsFloat > filterMax) valueAsFloat = filterMax;
				else if (valueAsFloat < filterMin) valueAsFloat = filterMin;
				const valueAsString = valueAsFloat.toString();
				currentFilter[0] = valueAsString;
				if (currentFilter[1] !== '') {
					if (valueAsFloat > parseFloat(currentFilter[1])) currentFilter[1] = valueAsString;
				}
			}

			if (side === 'max') {
				if (filterMin > valueAsFloat) valueAsFloat = filterMin;
				currentFilter[1] = valueAsFloat.toString();
			}

			filtersParams[parentKey] = currentFilter;

			let search = collectFilterParameters(filtersParams);
			searchParams['filter'] = search;

			applyFilter();
		} else {
			event.target.value = event.target.defaultValue;
		}
	}
};

const collectFilterParameters = (filterParam: { [K: string]: string[] } | null): string => {
	let res = '';
	if (filterParam === null) return res;

	let filterLength = Object.keys(filterParam).length - 1;
	Object.entries(filterParam).forEach(([key, value], index) => {
		res += key + ':' + value.join('$');
		if (index !== filterLength) res += ';';
	});
	return res;
};

function FacetFilter(): JSX.Element {
	const router = useRouter();
	const [filters, setFilters] = useState<{ count: number; filtered: FilterData }>(null!);
	const { maincategory, category } = router.query as { maincategory: string; category: string };

	let url = '/api/products/filters/';
	if (maincategory) url += `${maincategory}/`;
	if (category) url += `${category}/`;

	const searchParams = router.query;
	const getActiveFilters = getFilterParameters(searchParams);
	const getActiveFiltersLength = Object.keys(getActiveFilters).length;
	const FilterCount = Object.keys(filters?.filtered ?? {}).length;

	//eslint-disable-next-line
	let [fetchUrl, SearchParams] = SearchParamsBuilder(url, searchParams, 'filter');

	useEffect(() => {
		fetchData(SearchParams);
		//eslint-disable-next-line
	}, [maincategory, category, SearchParams]);

	const fetchData = (searchParams: string) => {
		axios({
			method: 'GET',
			url: fetchUrl,
		}).then((response) => {
			setFilters(response.data);
		});
	};

	const CheckboxFilter = ({
		parentKey,
		filterData,
		applyFilter,
		callback,
	}: {
		parentKey: string;
		filterData: FilterItem;
		applyFilter: 'update' | 'apply';
		callback?: (...args: any[]) => void;
	}): JSX.Element => {
		return (
			<div className="facet__filter__wrapper facet__filter__string">
				{Object.entries(filterData.values).map(([key, value], index) => {
					const isChecked =
						getActiveFilters[parentKey] !== undefined && getActiveFilters[parentKey].includes(key);
					return (
						<div className="facet__filter__item" key={parentKey + `-${key}`}>
							<input
								type="checkbox"
								id={`${key}-${index}-${applyFilter}`}
								className="filter__custom__checkbox"
								onClick={(e) => {
									if (value.items !== 0 || isChecked)
										filterOnCheck(e, key, parentKey, router, applyFilter, callback ?? (() => {}));
								}}
								disabled={value.items === 0 && !isChecked}
								defaultChecked={isChecked}
							></input>
							<label htmlFor={`${key}-${index}-${applyFilter}`} className="facet__filter__item__label">
								<span className="facet__filter__item__name">{value.name}</span>
								<span className="facet__filter__item__count">{value.items}</span>
							</label>
						</div>
					);
				})}
			</div>
		);
	};

	const InputFilter = ({
		parentKey,
		filterData,
		applyFilter,
		callback,
	}: {
		parentKey: string;
		filterData: FilterItem;
		applyFilter: 'apply' | 'update';
		callback?: (...args: any[]) => void;
	}): JSX.Element => {
		let values = filterData.values;
		const defaultValues = getActiveFilters[parentKey];
		const defaultValueMin = defaultValues ? parseFloat(defaultValues[0]).toFixed(2) : null;
		const defaultValueMax = defaultValues ? parseFloat(defaultValues[1]).toFixed(2) : null;
		const isDisabled = values.min === null || values.max === null || values.min === values.max;
		return (
			<div className="facet__filter__wrapper facet__filter__number">
				<div className="facet__filter__number__inputs__wrapper">
					<input
						type="text"
						className={`facet__filter__number__input facet__filter__number__input__left ${
							isDisabled ? 'facet__filter__number__disabled' : ''
						}`}
						placeholder={`От ${values.min}`}
						defaultValue={defaultValues ? defaultValues[0] : ''}
						disabled={defaultValueMin ? !(defaultValueMin !== '') : isDisabled}
						onBlur={(event) => {
							if (!isDisabled)
								return filterOnInput(
									event,
									'min',
									parentKey,
									filterData,
									router,
									applyFilter,
									callback ?? (() => {}),
								);
						}}
					/>
					<span className="facet__filter__number__slash">-</span>
					<input
						type="text"
						className={`facet__filter__number__input facet__filter__number__input__right ${
							isDisabled ? 'facet__filter__number__disabled' : ''
						}`}
						placeholder={`До ${values.max}`}
						defaultValue={defaultValues ? defaultValues[1] : ''}
						disabled={defaultValueMax ? !(defaultValueMax !== '') : isDisabled}
						onBlur={(event) => {
							if (!isDisabled)
								return filterOnInput(
									event,
									'max',
									parentKey,
									filterData,
									router,
									applyFilter,
									callback ?? (() => {}),
								);
						}}
					/>
				</div>
			</div>
		);
	};

	const FoundedItemsButton = ({
		count,
		onClick,
	}: {
		count: number;
		onClick?: (...args: any[]) => void;
	}): JSX.Element => {
		if (count === 0) {
			return (
				<button className={`filter__founded__items__button filter__founded__items__button__empty`}>
					Пустой результат
				</button>
			);
		}
		return (
			<button
				className={`filter__founded__items__button`}
				onClick={() => {
					if (onClick) onClick();
					window.scrollTo({
						behavior: 'smooth',
						top: 0,
						left: 0,
					});
					router.push({ pathname: router.pathname, query: searchParams });
				}}
			>
				Показать {count} {declOfNum(count, ['товар', 'товара', 'товаров'])}
			</button>
		);
	};

	const ClearFiltersButton = ({ onClick }: { onClick?: () => void }): JSX.Element => {
		return (
			<button
				className="filter__clear__button"
				onClick={() => {
					window.scrollTo({ behavior: 'smooth', top: 0, left: 0 });
					delete router.query?.filter;
					router.push(router);
					if (onClick) onClick();
				}}
			>
				Очистить фильтры
			</button>
		);
	};

	const AllFilterComponent = ({
		filterData,
	}: {
		filterData: { count: number; filtered: FilterData };
	}): JSX.Element => {
		const [FilterData, setFilterData] = useState<{ count: number; filtered: FilterData }>(filterData);
		const [toggle, setToggle] = useToggle();
		const router = useRouter();
		const currenFilter = useRef<string>('');
		const randomKey = useRef<string>('');

		let filtersCount = Object.keys(filters?.filtered ?? {}).length;
		let itemsPerColumn = Math.ceil(filtersCount / 3);

		const fetchData = (searchParams: string) => {
			let fetchURL = url + searchParams;
			axios({
				method: 'GET',
				url: fetchURL,
			}).then((response) => {
				setFilterData(response.data);
			});
		};

		useEffect(() => {
			if (toggle) document.body.style.overflow = 'hidden';
			else document.body.style.overflow = 'unset';
		}, [toggle]);

		const Close = (): void => {
			if (currenFilter.current !== '') {
				router.query['filter'] = currenFilter.current;
			}
			setFilterData({ ...filterData });
			setToggle(false);
		};

		return (
			<>
				<button
					className="filter__show__all"
					onClick={() => {
						currenFilter.current = (router.query['filter'] as string) ?? '';
						randomKey.current = Math.random().toString(32);
						setToggle();
					}}
				>
					Показать все фильтры
				</button>
				<div className={`filter__modal__wrapper ${toggle ? 'filter__modal__wrapper__active' : ''}`}>
					<div
						className={`filter__modal__blackscreen ${toggle ? 'filter__modal__blackscreen__active' : ''}`}
						onClick={Close}
					/>
					<div className="filter__modal__content__wrapper">
						<div className="filter__modal__content">
							<div className="filter__modal__content__header">
								<div className="content__header__wrapper">
									<h3 className="filter__modal__content__header">Все фильтры</h3>
									<p className="filters__modal__count">
										всего {filtersCount}{' '}
										{declOfNum(filtersCount, ['параметр', 'параметра', 'параметров'])}
									</p>
								</div>
								<div className="filter__modal__close__wrapper">
									<button className="filter__modal__close__wrapper__button" onClick={Close}>
										<FontAwesomeIcon icon={faXmark} />
									</button>
								</div>
							</div>
							<hr className="break__line__standard"></hr>
							<div className="filter__modal__content__items__wrapper">
								<div className="filter__modal__content__items" key={randomKey.current}>
									{[1, 2, 3].map((column) => {
										let start = itemsPerColumn * (column - 1);
										let end = itemsPerColumn * column;
										return (
											<div className="filter__column" key={`filter-column-${column}`}>
												{Object.entries(FilterData?.filtered ?? {})
													.slice(start, end)
													.map(([parentKey, parentValue]) => {
														const DropdownHeader = (
															<span className="dropdown__label">{parentValue.name}</span>
														);
														return (
															<Dropdown
																header={DropdownHeader}
																key={'modal-filter-' + parentKey}
															>
																<OverflowContainer maxHeight={290}>
																	{parentValue.valueType === 'string' ? (
																		<CheckboxFilter
																			parentKey={parentKey}
																			filterData={parentValue}
																			applyFilter={'update'}
																			callback={fetchData}
																		/>
																	) : (
																		<InputFilter
																			parentKey={parentKey}
																			filterData={parentValue}
																			applyFilter={'update'}
																			callback={fetchData}
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
								<button className="filter__modal__return__button" onClick={Close}>
									Возрат
								</button>
								<FoundedItemsButton count={FilterData?.count ?? 0} onClick={() => setToggle(false)} />
								<ClearFiltersButton onClick={() => setToggle(false)} />
							</div>
						</div>
					</div>
				</div>
			</>
		);
	};

	//FilterSkeleton
	return (
		<>
			<div>
				{filters?.filtered !== undefined ? (
					Object.entries(filters?.filtered ?? {})
						.slice(0, 10)
						.map(([parentKey, parentValue], index) => {
							const DropdownHeader = <span className="dropdown__label">{parentValue.name}</span>;
							return (
								<Dropdown header={DropdownHeader} key={'filter-' + parentKey}>
									<OverflowContainer maxHeight={290}>
										{parentValue.valueType === 'string' ? (
											<CheckboxFilter
												parentKey={parentKey}
												filterData={parentValue}
												applyFilter={'apply'}
												callback={fetchData}
											/>
										) : (
											<InputFilter
												parentKey={parentKey}
												filterData={parentValue}
												applyFilter={'apply'}
												callback={fetchData}
											/>
										)}
									</OverflowContainer>
								</Dropdown>
							);
						})
				) : (
					<FilterSkeleton />
				)}
				{FilterCount > 10 ? <AllFilterComponent filterData={filters} /> : ''}
				{getActiveFiltersLength > 0 ? <ClearFiltersButton /> : ''}
			</div>
		</>
	);
}

export default FacetFilter;