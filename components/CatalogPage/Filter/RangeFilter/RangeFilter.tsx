import { ReactElement } from 'react';
import { FilterApplyFN, FilterElementActionConfigRange, FilterElementConfigNumber, RangeFilterSide } from '../interface';

import { collectFilterParameters } from '../Filter';

import './RangeFilter.scss';

const filterOnInput = (config: FilterElementActionConfigRange) => {
	const activeFilters = config.activeFilters;
	const value = (config.event.target as HTMLInputElement).value;

	const applyFilter = () => {
		const filtersCount = Object.keys(activeFilters).length;
		if (config.applyFunction === FilterApplyFN.APPLY) {
			if (filtersCount === 0) {
				config.searchParams.delete('filter');
			}
			config.searchParams.set('page', '1');
			config.router.push(config.path + '?' + config.searchParams);
		} else if (config.applyFunction === FilterApplyFN.UPDATE && config.callback) {
			config.callback(config.searchParams);
		}
	};

	const currentFilter = activeFilters[config.parentKey] ?? ['', ''];

	let valueAsFloat = parseFloat(parseFloat(value.replaceAll(',', '.')).toFixed(2));
	const valueIsNumber = !isNaN(valueAsFloat);

	if (value !== currentFilter[config.side === RangeFilterSide.MIN ? 0 : 1]) {
		if (value === '') {
			currentFilter[config.side === RangeFilterSide.MIN ? 0 : 1] = '';

			if (!currentFilter[0] && !currentFilter[1]) {
				delete activeFilters[config.parentKey];
			}

			config.searchParams.set('filter', collectFilterParameters(activeFilters));

			applyFilter();
		} else if (valueIsNumber && valueAsFloat > 0) {
			const filterMin = config.filterData.min;
			const filterMax = config.filterData.max;

			if (config.side === RangeFilterSide.MIN) {
				if (valueAsFloat > filterMax) valueAsFloat = filterMax;
				else if (valueAsFloat < filterMin) valueAsFloat = filterMin;
				const valueAsString = valueAsFloat.toString();
				currentFilter[0] = valueAsString;
				if (currentFilter[1] !== '') {
					if (valueAsFloat > parseFloat(currentFilter[1])) currentFilter[1] = valueAsString;
				}
			}

			if (config.side === RangeFilterSide.MAX) {
				valueAsFloat = filterMin > valueAsFloat ? filterMin : valueAsFloat;
				currentFilter[1] = valueAsFloat.toString();
			}

			activeFilters[config.parentKey] = currentFilter;
			config.searchParams.set('filter', collectFilterParameters(activeFilters));
			applyFilter();
		} else {
			config.event.target.value = config.event.target.defaultValue;
		}
	}
};

const RangeFilter = ({ config }: { config: FilterElementConfigNumber }): ReactElement => {
	const values = config.filterData;
	const defaultValues = config.ActiveFilters[config.parentKey];
	const defaultValueMin = defaultValues ? parseFloat(defaultValues[0]).toFixed(2) : null;
	const defaultValueMax = defaultValues ? parseFloat(defaultValues[1]).toFixed(2) : null;
	const isDisabled = defaultValues === undefined && values.min === values.max;

	return (
		<div className="facet__filter__wrapper facet__filter__number">
			<div className="facet__filter__number__inputs__wrapper">
				<input
					type="text"
					className={`facet__filter__number__input facet__filter__number__input__left ${isDisabled ? 'facet__filter__number__disabled' : ''}`}
					placeholder={`От ${values.min}`}
					defaultValue={defaultValues ? defaultValues[0] : null}
					disabled={defaultValueMin ? !(defaultValueMin !== '') : isDisabled}
					key={`input__left__${defaultValues ? 'active' : 'inactive'}`}
					onBlur={
						!isDisabled
							? (event) =>
									filterOnInput({
										event: event,
										side: RangeFilterSide.MIN,
										parentKey: config.parentKey,
										filterData: config.filterData,
										router: config.router,
										applyFunction: config.applyFilter,
										callback: config.callback,
										searchParams: config.searchParams,
										path: config.path,
										activeFilters: config.ActiveFilters,
									})
							: undefined
					}
				/>
				<span className="facet__filter__number__slash">-</span>
				<input
					type="text"
					className={`facet__filter__number__input facet__filter__number__input__right ${isDisabled ? 'facet__filter__number__disabled' : ''}`}
					placeholder={`До ${values.max}`}
					defaultValue={defaultValues ? defaultValues[1] : null}
					disabled={defaultValueMax ? !(defaultValueMax !== '') : isDisabled}
					key={`input__right__${defaultValues ? 'active' : 'inactive'}`}
					onBlur={
						!isDisabled
							? (event) =>
									filterOnInput({
										event: event,
										side: RangeFilterSide.MAX,
										parentKey: config.parentKey,
										filterData: config.filterData,
										router: config.router,
										applyFunction: config.applyFilter,
										callback: config.callback,
										searchParams: config.searchParams,
										path: config.path,
										activeFilters: config.ActiveFilters,
									})
							: undefined
					}
				/>
			</div>
		</div>
	);
};

export { RangeFilter };
