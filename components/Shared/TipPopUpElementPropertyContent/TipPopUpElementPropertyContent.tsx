import { ReactElement } from 'react';
import { Capitalize } from '../../../utils/Capitalize';

import { TipPopUpElement } from '../TipPopUpElement/TipPopUpElement';

import './TipPopUpElementPropertyContent.scss';

function TipPopUpElementPropertyContent({
	header,
	description,
	stopPropagation,
	parent,
}: {
	header: string;
	description: string;
	stopPropagation?: boolean;
	parent?: HTMLElement;
}): ReactElement {
	return (
		<TipPopUpElement stopPropagation={stopPropagation ?? false} parent={parent}>
			<div className="properties__tip__pop__wrapper">
				<p className="properties__tip__pop__header">{Capitalize(header)}</p>
				<p className="properties__tip__pop__description">{description}</p>
			</div>
		</TipPopUpElement>
	);
}

export { TipPopUpElementPropertyContent };
