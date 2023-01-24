import './WidthLimiter.scss';

export default function WidthLimiter({ children }: { children: JSX.Element }): JSX.Element {
	return <div className="width__limiter">{children}</div>;
}
