import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { centerModalControl } from '../../../../store';
import { declOfNum } from '../../../../utils';
import { ModalWrapper } from '../../../CentralModal/CenterModal';
import Dropdown from '../../../Shared/Dropdown/Dropdown';
import CheckboxFilter from '../CheckboxFilter/CheckboxFilter';
import InputFilter from '../InputFilter/InputFilter';
import { FilterData, FilterFetchData, FilterParameters, FilterApplyFN } from '../interface';

import './AllFilterComponent.scss';

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
			Показать {count} {declOfNum(count, ['товар', 'товара', 'товаров'])}
		</button>
	);
};

const ClearFiltersButton = ({
	onClick,
	searchParams,
	pathname,
	router,
}: {
	onClick?: () => void;
	searchParams: URLSearchParams;
	pathname: string;
	router: AppRouterInstance;
}): JSX.Element => {
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
	initialFilters,
	fetchURL,
	ActiveFilters,
}: {
	filterData: { count: number; filtered: FilterData };
	currentFilterQuery: string | undefined;
	initialFilters: FilterFetchData;
	fetchURL: string;
	ActiveFilters: FilterParameters;
}): JSX.Element => {
	const [FilterData, setFilterData] = useState<{ count: number; filtered: FilterData }>(filterData);
	const router = useRouter();

	const searchParams = useRef<URLSearchParams>(new URLSearchParams(useSearchParams()));
	const pathname = usePathname();

	const currenFilter = useRef<string>(currentFilterQuery ?? '');
	const randomKey = useRef<string>('');

	const filtersCount = Object.keys(initialFilters?.filtered ?? {}).length;
	const itemsPerColumn = Math.ceil(filtersCount / 3);

	const fetchData = (searchParams: string) => {
		axios({
			method: 'GET',
			url: fetchURL + searchParams,
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

	return createPortal(
		<ModalWrapper id={'FilterModal'}>
			<div className="modal__content filter__modal__content">
				<div className="filter__modal__content__header">
					<div className="content__header__wrapper">
						<h3 className="filter__modal__content__header">Все фильтры</h3>
						<p className="filters__modal__count">
							всего {filtersCount} {declOfNum(filtersCount, ['параметр', 'параметра', 'параметров'])}
						</p>
					</div>
					<div className="filter__modal__close__wrapper">
						<button className="modal__close__wrapper__button" onClick={() => centerModalControl.toggle('FilterModal')}>
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
													{parentValue.valueType === 'string' ? (
														<CheckboxFilter
															config={{
																parentKey: parentKey,
																filterData: parentValue,
																applyFilter: FilterApplyFN.UPDATE,
																callback: fetchData,
																router: router,
																ActiveFilters: ActiveFilters,
																searchParams: searchParams.current,
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
				<div className="filter__modal__footer__items">
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
					<ClearFiltersButton
						onClick={() => centerModalControl.toggle('FilterModal')}
						searchParams={searchParams.current}
						pathname={pathname}
						router={router}
					/>
				</div>
			</div>
		</ModalWrapper>,
		document.body,
	);
};

export { AllFilterComponent, ClearFiltersButton };
