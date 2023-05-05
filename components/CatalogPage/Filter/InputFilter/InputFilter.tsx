import { ReactElement } from 'react';
import { FilterApplyFN, FilterElementActionConfigRange, FilterElementConfig, RangeFilterSide } from '../interface';

import { collectFilterParameters, getFilterParameters } from '../Filter';

import './InputFilter.scss';

const filterOnInput = (config: FilterElementActionConfigRange) => {
	const searchParams = config.router.query;
	const filtersParams = getFilterParameters(searchParams);
	const value = (config.event.target as HTMLInputElement).value;

	const applyFilter = () => {
		const filtersCount = Object.keys(filtersParams).length;
		if (config.applyFunction === FilterApplyFN.APPLY) {
			if (filtersCount === 0) {
				delete searchParams['filter'];
			}
			searchParams['page'] = '1';
			config.router.push({ pathname: config.router.pathname, query: searchParams }, undefined, { scroll: false });
		} else if (config.applyFunction === FilterApplyFN.UPDATE && config.callback) {
			config.callback(filtersCount !== 0 ? `?filter=${searchParams['filter']}` : '');
		}
	};

	const currentFilter = filtersParams[config.parentKey] ?? ['', ''];

	let valueAsFloat = parseFloat(parseFloat(value.replaceAll(',', '.')).toFixed(2));
	const valueIsNumber = !isNaN(valueAsFloat);

	if (value !== currentFilter[config.side === RangeFilterSide.MIN ? 0 : 1]) {
		if (value === '') {
			currentFilter[config.side === RangeFilterSide.MIN ? 0 : 1] = '';

			if (!currentFilter[0] && !currentFilter[1]) {
				delete filtersParams[config.parentKey];
			}

			searchParams['filter'] = collectFilterParameters(filtersParams);

			applyFilter();
		} else if (valueIsNumber && valueAsFloat > 0) {
			const filterMin = config.filterData.values.min as unknown as number;
			const filterMax = config.filterData.values.max as unknown as number;

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

			filtersParams[config.parentKey] = currentFilter;

			searchParams['filter'] = collectFilterParameters(filtersParams);

			applyFilter();
		} else {
			config.event.target.value = config.event.target.defaultValue;
		}
	}
};

const RangeFilter = ({ config }: { config: FilterElementConfig }): ReactElement => {
	const values = config.filterData.values;
	const defaultValues = config.ActiveFilters[config.parentKey];
	const defaultValueMin = defaultValues ? parseFloat(defaultValues[0]).toFixed(2) : null;
	const defaultValueMax = defaultValues ? parseFloat(defaultValues[1]).toFixed(2) : null;
	const isDisabled = values.min === null || values.max === null || values.min === values.max;

	return (
		<div className="facet__filter__wrapper facet__filter__number">
			<div className="facet__filter__number__inputs__wrapper">
				<input
					type="text"
					className={`facet__filter__number__input facet__filter__number__input__left ${isDisabled ? 'facet__filter__number__disabled' : ''}`}
					placeholder={`От ${values.min}`}
					defaultValue={defaultValues ? defaultValues[0] : ''}
					disabled={defaultValueMin ? !(defaultValueMin !== '') : isDisabled}
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
									})
							: undefined
					}
				/>
				<span className="facet__filter__number__slash">-</span>
				<input
					type="text"
					className={`facet__filter__number__input facet__filter__number__input__right ${isDisabled ? 'facet__filter__number__disabled' : ''}`}
					placeholder={`До ${values.max}`}
					defaultValue={defaultValues ? defaultValues[1] : ''}
					disabled={defaultValueMax ? !(defaultValueMax !== '') : isDisabled}
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
									})
							: undefined
					}
				/>
			</div>
		</div>
	);
};

export default RangeFilter;
