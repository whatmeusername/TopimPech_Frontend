import { Capitalize } from '../../../../utils/Capitalize';
import { TipPopUpElementPropertyContent } from '../../../Shared/TipPopUpElementPropertyContent/TipPopUpElementPropertyContent';
import { FilterItemObject, FilterItemNumber } from '../interface';
import './FilterDropdownLabel.scss';

function FilterDropdownLabel({ parentValue, TipPopParent }: { parentValue: FilterItemObject | FilterItemNumber; TipPopParent?: HTMLElement }) {
	return (
		<span className="dropdown__label__wrapper">
			<p className="dropdown__label">
				{Capitalize(parentValue.other.label)}
				{parentValue.other.unit ? `, ${parentValue.other.unit}` : ''}
			</p>
			{parentValue.other.description ? (
				<TipPopUpElementPropertyContent
					header={parentValue.other.label}
					description={parentValue.other.description}
					stopPropagation={true}
					parent={TipPopParent}
				/>
			) : null}
		</span>
	);
}

export { FilterDropdownLabel };
