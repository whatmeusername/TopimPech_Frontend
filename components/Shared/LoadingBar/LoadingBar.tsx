import { ReactElement } from 'react';
import './LoadingBar.scss';

function LoadingBar({ label, usePrimaryColor }: { label?: string; usePrimaryColor?: boolean }): ReactElement {
	return (
		<div className={`loading_bar__wrapper ${usePrimaryColor ? 'loading_bar__wrapper__primary__color' : ''}`}>
			<div className="loading_bar__roller">
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
				<div />
			</div>
			{label ? <p className="loading_bar__label">{label}</p> : null}
		</div>
	);
}

export { LoadingBar };
