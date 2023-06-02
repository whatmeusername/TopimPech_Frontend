import { ReactElement } from 'react';
import { getFilterParameters, collectFilterParameters } from '../Filter';
import { FilterApplyFN, FilterElementActionConfig, FilterElementConfig } from '../interface';

import './CheckboxFilter.scss';

const filterOnCheck = (config: FilterElementActionConfig) => {
	const checked = (config.event.target as HTMLInputElement).checked;
	const filtersParams = getFilterParameters(config.searchParams);
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
		config.searchParams.set('filter', searchParamsSTR);
	} else config.searchParams.delete('filter');

	if (config.applyFunction === FilterApplyFN.APPLY) {
		config.searchParams.set('page', '1');
		config.router.replace(`${config.path}?${config.searchParams.toString()}`);
	} else if (config.applyFunction === FilterApplyFN.UPDATE && config.callback) {
		config.callback(`?filter=${searchParamsSTR}`);
	}
};

const CheckboxFilter = ({ config }: { config: FilterElementConfig }): ReactElement => {
	return (
		<div className="facet__filter__wrapper facet__filter__string">
			{config.filterData.items.map((option, index) => {
				const value = option.value;
				const isChecked = config.ActiveFilters[config.parentKey] !== undefined && config.ActiveFilters[config.parentKey].includes(value);
				return (
					<div className="facet__filter__item" key={`${config.parentKey}-${value}-${isChecked}}`}>
						<input
							type="checkbox"
							id={`${value}-${index}-${config.applyFilter}`}
							className="filter__custom__checkbox"
							onClick={
								option.count !== 0 || isChecked
									? (event) =>
											filterOnCheck({
												event: event,
												key: value,
												parentKey: config.parentKey,
												router: config.router,
												applyFunction: config.applyFilter,
												callback: config.callback,
												searchParams: config.searchParams,
												path: config.path,
											})
									: undefined
							}
							disabled={option.count === 0 && !isChecked}
							defaultChecked={isChecked}
						/>
						<label htmlFor={`${value}-${index}-${config.applyFilter}`} className="facet__filter__item__label">
							<span className="facet__filter__item__name">{option.label}</span>
							<span className="facet__filter__item__count">{option.count}</span>
						</label>
					</div>
				);
			})}
		</div>
	);
};

export default CheckboxFilter;
