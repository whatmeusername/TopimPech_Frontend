import axios from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { useState, useRef, ReactElement } from 'react';
import { centerModalControl } from '../../../../store';
import { SearchParamsBuilder, declOfNum, declOfProduct } from '../../../../utils';
import Dropdown from '../../../Shared/Dropdown/Dropdown';
import CheckboxFilter from '../CheckboxFilter/CheckboxFilter';

import { FacetFiltersData, FilterFetchData, FilterParameters, FilterApplyFN, FacetType, FilterItemObject, FilterItemNumber } from '../interface';

import './AllFilterComponent.scss';
import { useMobile } from '../../../../context/MobileContext/MobileContext';
import { ModalWrapper, ModalContentWrapper, ModalHead, ModalFooterWrapper } from '../../../CentralModal/CenterModal';
import { ClearFiltersButton } from '../ClearFilterButton/ClearFiltersButton';
import { Capitalize } from '../../../../utils/Capitalize';
import { RangeFilter } from '../RangeFilter/RangeFilter';
import { useFilterPathname } from '../Filter';

const FoundedItemsButton = ({
	count,
	onClick,
	searchParams,
	pathname,
	router,
}: {
	count: number;
	onClick?: (...args: any[]) => void;
	searchParams: URLSearchParams;
	pathname: string;
	router: AppRouterInstance;
}): JSX.Element => {
	if (count === 0) {
		return <button className={'filter__founded__items__button filter__founded__items__button__empty filter__modal__button'}>Пустой результат</button>;
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
			Показать {count} {declOfProduct(count)}
		</button>
	);
};

const AllFilterComponent = ({
	filterData,
	currentFilterQuery,
	initialFilters,
	fetchURL,
	ActiveFilters,
}: {
	filterData: { count: number; filtered: FacetFiltersData };
	currentFilterQuery: string | undefined;
	initialFilters: FilterFetchData;
	fetchURL: string;
	ActiveFilters: FilterParameters;
}): ReactElement => {
	const [FilterData, setFilterData] = useState<{ count: number; filtered: FacetFiltersData }>(filterData);
	const router = useRouter();
	const isMobile = useMobile(768);

	const searchParams = useRef<URLSearchParams>(new URLSearchParams(useSearchParams() as any));
	const pathname = useFilterPathname(initialFilters);

	const currenFilter = useRef<string>(currentFilterQuery ?? '');
	const randomKey = useRef<string>('');

	const filtersCount = Object.keys(initialFilters?.filtered ?? {}).length;
	const itemsPerColumn = Math.ceil(filtersCount / 3);

	const fetchData = (searchParams: URLSearchParams) => {
		axios({
			method: 'GET',
			url: SearchParamsBuilder(fetchURL, searchParams, 'search', 'filter')[0],
		}).then((response) => {
			setFilterData(response.data);
		});
	};

	const Close = (): void => {
		if (currenFilter.current !== '') {
			searchParams.current.set('filter', currenFilter.current);
		}
		setFilterData({ ...filterData });
	};

	return (
		<ModalWrapper id={'FilterModal'}>
			<ModalContentWrapper className="filter__modal__content">
				<ModalHead className="filter__modal__content__header">
					<div className="content__header__wrapper">
						<h3 className="filter__modal__content__header">Все фильтры</h3>
						<p className="filters__modal__count">
							всего {filtersCount} {declOfNum(filtersCount, ['параметр', 'параметра', 'параметров'])}
						</p>
					</div>
				</ModalHead>

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
											const DropdownHeader = (
												<span className="dropdown__label">
													{Capitalize(parentValue.other.label)}
													{parentValue.other.unit ? `, ${parentValue.other.unit}` : ''}
												</span>
											);
											return (
												<Dropdown header={DropdownHeader} key={'modal-filter-' + parentKey}>
													{parentValue.type === FacetType.OBJECT ? (
														<CheckboxFilter
															config={{
																parentKey: parentKey,
																filterData: parentValue as FilterItemObject,
																applyFilter: FilterApplyFN.UPDATE,
																callback: fetchData,
																router: router,
																ActiveFilters: ActiveFilters,
																searchParams: searchParams.current,
																path: pathname,
															}}
														/>
													) : (
														<RangeFilter
															config={{
																parentKey: parentKey,
																filterData: parentValue as FilterItemNumber,
																applyFilter: FilterApplyFN.UPDATE,
																callback: fetchData,
																router: router,
																ActiveFilters: ActiveFilters,
																searchParams: searchParams.current,
																path: pathname,
															}}
														/>
													)}
												</Dropdown>
											);
										})}
								</div>
							);
						})}
					</div>
				</div>
				<ModalFooterWrapper isFixed={isMobile}>
					<button className="filter__modal__return__button filter__modal__button" onClick={Close}>
						Возрат
					</button>
					<FoundedItemsButton
						count={FilterData?.count ?? 0}
						onClick={() => centerModalControl.toggle('FilterModal')}
						searchParams={searchParams.current}
						pathname={pathname}
						router={router}
					/>
					<ClearFiltersButton onClick={() => centerModalControl.toggle('FilterModal')} />
				</ModalFooterWrapper>
			</ModalContentWrapper>
		</ModalWrapper>
	);
};

export { AllFilterComponent, ClearFiltersButton };
