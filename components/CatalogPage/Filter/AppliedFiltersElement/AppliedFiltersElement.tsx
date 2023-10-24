import { ReactElement } from 'react';
import './AppliedFiltersElement.scss';
import { useSearchParams, useRouter } from 'next/navigation';
import { DeleteIcon } from '../../../IconsElements';
import { collectFilterParameters, getFilterParameters, useFilterPathname } from '../Filter';
import {
	FilterElementRemoveConfig,
	FacetType,
	SearchParamsFilterQueryStringResult,
	SearchParamsFilterQueryNumberResult,
	FilterParameters,
	FilterFetchData,
} from '../interface';

const IsSearchParamsFilterQueryStringResult = (obj: any): obj is SearchParamsFilterQueryStringResult => {
	return Array.isArray(obj.items) && obj.type === FacetType.OBJECT;
};

const IsSearchParamsFilterQueryNumberResult = (obj: any): obj is SearchParamsFilterQueryNumberResult => {
	return typeof obj.items === 'object' && obj.type === FacetType.NUMBER;
};

const HandleObjectFilterDeletion = (config: FilterElementRemoveConfig) => {
	const activeFilters = config.activeFilters;
	const currentValue = activeFilters[config.parentKey];

	if (currentValue && config.type === FacetType.OBJECT) {
		const valueIndex = currentValue.findIndex((item) => item === config.key);
		activeFilters[config.parentKey].splice(valueIndex, 1);
		if (currentValue.length === 0) {
			delete activeFilters[config.parentKey];
		}
	} else if (currentValue) {
		delete activeFilters[config.parentKey];
	}

	const filtersParamsLength = Object.keys(activeFilters).length;
	const searchParamsSTR = collectFilterParameters(activeFilters);

	if (filtersParamsLength > 0) {
		config.searchParams.set('filter', searchParamsSTR);
	} else config.searchParams.delete('filter');

	config.searchParams.set('page', '1');
	config.router.replace(`${config.path}?${config.searchParams.toString()}`);
};

const AppliedFiltersItemObject = ({
	filter,
	activeFilters,
	pathname,
}: {
	filter: SearchParamsFilterQueryStringResult;
	activeFilters: FilterParameters;
	pathname: string;
}): ReactElement => {
	const router = useRouter();

	const searchParams = new URLSearchParams(useSearchParams() as any);

	return (
		<>
			{filter.items.map((item) => {
				return (
					<div className="catalog__applied__filters__item" key={`catalog__applied__filter__item__${item.value}`}>
						<div className="catalog__applied__filters__text">
							<p className="catalog__applied__filters__label">{filter.other.label}</p>
							<p className="catalog__applied__filters__value">{item.other.label}</p>
						</div>
						<div
							className="catalog__applied__filters__icon__wrapper"
							onClick={() => {
								HandleObjectFilterDeletion({
									parentKey: filter.value,
									key: item.value,
									router: router,
									type: filter.type,
									path: pathname,
									searchParams: searchParams,
									activeFilters: activeFilters,
								});
							}}
						>
							<DeleteIcon className="catalog__applied__filters__delete__icon" />
						</div>
					</div>
				);
			})}
		</>
	);
};

const AppliedFiltersItemNumber = ({
	filter,
	activeFilters,
	pathname,
}: {
	filter: SearchParamsFilterQueryNumberResult;
	activeFilters: FilterParameters;
	pathname: string;
}): ReactElement => {
	const min = filter.min;
	const max = filter.max;

	const router = useRouter();
	const searchParams = new URLSearchParams(useSearchParams() as any);

	return (
		<div className="catalog__applied__filters__item" key={`catalog__applied__filter__item__${filter.items.value}`}>
			<div className="catalog__applied__filters__text">
				<p className="catalog__applied__filters__label">{filter.other.label}</p>
				{min !== undefined ? <p className="catalog__applied__filters__value">от {min}</p> : null}
				{max !== undefined ? <p className="catalog__applied__filters__value">до {max}</p> : null}
			</div>
			<div
				className="catalog__applied__filters__icon__wrapper"
				onClick={() => {
					HandleObjectFilterDeletion({
						parentKey: filter.value,
						router: router,
						type: filter.type,
						path: pathname,
						searchParams: searchParams,
						activeFilters: activeFilters,
					});
				}}
			>
				<DeleteIcon className="catalog__applied__filters__delete__icon" />
			</div>
		</div>
	);
};
const AppliedFiltersElement = ({ filtersData }: { filtersData: FilterFetchData }): ReactElement | null => {
	const values = Object.values(filtersData.appliedFilters);

	const searchParams = new URLSearchParams(useSearchParams() as any);

	const activeFilters = getFilterParameters(searchParams, filtersData.appliedFilters);
	const pathname = useFilterPathname(filtersData);

	if (values.length === 0) return null;
	return (
		<div className="catalog__applied__filters__wrapper">
			{values.map((filter) => {
				if (IsSearchParamsFilterQueryStringResult(filter)) {
					return (
						<AppliedFiltersItemObject
							filter={filter}
							key={`catalog__applied__filter__${filter.value}`}
							activeFilters={activeFilters}
							pathname={pathname}
						/>
					);
				} else if (IsSearchParamsFilterQueryNumberResult(filter)) {
					return (
						<AppliedFiltersItemNumber
							filter={filter}
							key={`catalog__applied__filter__${filter.value}`}
							activeFilters={activeFilters}
							pathname={pathname}
						/>
					);
				}
				return null;
			})}
		</div>
	);
};

export { AppliedFiltersElement, IsSearchParamsFilterQueryStringResult, IsSearchParamsFilterQueryNumberResult };
