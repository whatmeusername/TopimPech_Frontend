import type { ReactElement } from 'react';
import './WidthLimiter.scss';

export default function WidthLimiter({ children }: { children: ReactElement }): ReactElement {
	return <div className="width__limiter">{children}</div>;
}
