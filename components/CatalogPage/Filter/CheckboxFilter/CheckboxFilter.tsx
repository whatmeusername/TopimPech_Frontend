import { ReactElement } from 'react';
import { getFilterParameters, collectFilterParameters } from '../Filter';
import { FilterApplyFN, FilterElementActionConfig, FilterElementConfig } from '../interface';

import './CheckboxFilter.scss';

const filterOnCheck = (config: FilterElementActionConfig) => {
	const searchParams = config.router.query;

	const checked = (config.event.target as HTMLInputElement).checked;
	const filtersParams = getFilterParameters(searchParams);
	const currentValue = filtersParams[config.parentKey];

	if (checked) {
		if (!currentValue) {
			filtersParams[config.parentKey] = [config.key];
		} else if (!currentValue.includes(config.key)) {
			filtersParams[config.parentKey].push(config.key);
		}
	} else if (currentValue) {
		const valueIndex = currentValue.findIndex((item) => item === config.key);
		filtersParams[config.parentKey].splice(valueIndex, 1);
		if (currentValue.length === 0) {
			delete filtersParams[config.parentKey];
		}
	}

	const filtersParamsLength = Object.keys(filtersParams).length;
	const searchParamsSTR = collectFilterParameters(filtersParams);

	if (filtersParamsLength > 0) {
		searchParams['filter'] = searchParamsSTR;
	} else delete searchParams['filter'];

	if (config.applyFunction === FilterApplyFN.APPLY) {
		searchParams['page'] = '1';
		config.router.push({ pathname: config.router.pathname, query: searchParams }, undefined, { scroll: false });
	} else if (config.applyFunction === FilterApplyFN.UPDATE && config.callback) {
		config.callback(`?filter=${searchParamsSTR}`);
	}
};

const CheckboxFilter = ({ config }: { config: FilterElementConfig }): ReactElement => {
	return (
		<div className="facet__filter__wrapper facet__filter__string">
			{Object.entries(config.filterData.values).map(([key, value], index) => {
				const isChecked = config.ActiveFilters[config.parentKey] !== undefined && config.ActiveFilters[config.parentKey].includes(key);
				return (
					<div className="facet__filter__item" key={`${config.parentKey}-${key}-${isChecked}}`}>
						<input
							type="checkbox"
							id={`${key}-${index}-${config.applyFilter}`}
							className="filter__custom__checkbox"
							onClick={
								value.items !== 0 || isChecked
									? (event) =>
											filterOnCheck({
												event: event,
												key: key,
												parentKey: config.parentKey,
												router: config.router,
												applyFunction: config.applyFilter,
												callback: config.callback,
											})
									: undefined
							}
							disabled={value.items === 0 && !isChecked}
							defaultChecked={isChecked}
						/>
						<label htmlFor={`${key}-${index}-${config.applyFilter}`} className="facet__filter__item__label">
							<span className="facet__filter__item__name">{value.name}</span>
							<span className="facet__filter__item__count">{value.items}</span>
						</label>
					</div>
				);
			})}
		</div>
	);
};

export default CheckboxFilter;
