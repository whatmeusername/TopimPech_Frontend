import { ReactElement } from 'react';
import { Capitalize } from '../../../utils/Capitalize';
import { Property } from '../../CatalogComponents/Cards/interface';
import { TipPopUpElement } from '../TipPopUpElement/TipPopUpElement';

import './TipPopUpElementPropertyContent.scss';

function TipPopUpElementPropertyContent({ property }: { property: Property }): ReactElement {
	return (
		<TipPopUpElement>
			<div className="properties__tip__pop__wrapper">
				<p className="properties__tip__pop__header">{Capitalize(property.key.name)}</p>
				<p className="properties__tip__pop__description">{property.key.description}</p>
			</div>
		</TipPopUpElement>
	);
}

export { TipPopUpElementPropertyContent };
