import { ReactElement } from 'react';
import './ThinBreakLine.scss';

function ThinBreakLine({ className }: { className?: string }): ReactElement {
	return <hr className={`break__line__thin ${className}`} />;
}

export { ThinBreakLine };
