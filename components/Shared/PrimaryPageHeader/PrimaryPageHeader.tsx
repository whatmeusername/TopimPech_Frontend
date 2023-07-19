import { ToPreviousPageButton } from '../ToPreviousPageButton/ToPreviousPageButton';
import './PrimaryPageHeader.scss';

function PrimaryPageHeader({ header }: { header: string }) {
	return (
		<div className="primary__page__header">
			<ToPreviousPageButton />
			<h1 className="primary__page__header">{header}</h1>
		</div>
	);
}

export { PrimaryPageHeader };
