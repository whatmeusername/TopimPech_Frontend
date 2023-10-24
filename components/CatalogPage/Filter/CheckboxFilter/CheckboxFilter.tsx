import { ReactElement } from 'react';
import { collectFilterParameters } from '../Filter';
import { FilterApplyFN, FilterElementActionConfig, FilterElementConfig } from '../interface';

import './CheckboxFilter.scss';

const filterOnCheck = (config: FilterElementActionConfig) => {
	const checked = (config.event.target as HTMLInputElement).checked;
	const activeFitlers = config.activeFilters;
	const currentValue = activeFitlers[config.parentKey];

	if (checked) {
		if (!currentValue) {
			config.activeFilters[config.parentKey] = [config.key];
		} else if (!currentValue.includes(config.key)) {
			activeFitlers[config.parentKey].push(config.key);
		}
	} else if (currentValue) {
		const valueIndex = currentValue.findIndex((item) => item === config.key);
		activeFitlers[config.parentKey].splice(valueIndex, 1);
		if (currentValue.length === 0) {
			delete activeFitlers[config.parentKey];
		}
	}

	const filtersParamsLength = Object.keys(activeFitlers).length;
	const searchParamsSTR = collectFilterParameters(activeFitlers);

	if (filtersParamsLength > 0) {
		config.searchParams.set('filter', searchParamsSTR);
	} else config.searchParams.delete('filter');

	if (config.applyFunction === FilterApplyFN.APPLY) {
		config.searchParams.set('page', '1');
		config.router.replace(`${config.path}?${config.searchParams.toString()}`);
	} else if (config.applyFunction === FilterApplyFN.UPDATE && config.callback) {
		config.callback(config.searchParams);
	}
};

const CheckboxFilter = ({ config }: { config: FilterElementConfig }): ReactElement => {
	return (
		<div className="facet__filter__wrapper facet__filter__string">
			{config.filterData.items.map((option) => {
				const value = option.value;
				const isChecked = config.ActiveFilters[config.parentKey] !== undefined && config.ActiveFilters[config.parentKey].includes(value);

				return (
					<div className="facet__filter__item" key={`${config.parentKey}-${value}-${isChecked}}`}>
						<input
							type="checkbox"
							id={`${config.parentKey}_${value}-${config.applyFilter}`}
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
												activeFilters: config.ActiveFilters,
											})
									: undefined
							}
							disabled={option.count === 0 && !isChecked}
							defaultChecked={isChecked}
						/>
						<label htmlFor={`${config.parentKey}_${value}-${config.applyFilter}`} className="facet__filter__item__label">
							<span className="facet__filter__item__name">{`${option.other.label} ${config.filterData.other.unit ?? ''}`}</span>
							<span className="facet__filter__item__count">{option.count}</span>
						</label>
					</div>
				);
			})}
		</div>
	);
};

export default CheckboxFilter;
