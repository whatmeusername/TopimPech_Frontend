import { ReactElement } from 'react';
import './LoadingBar.scss';

function LoadingBar({ label }: { label?: string }): ReactElement {
	return (
		<div className="loading_bar__wrapper">
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
