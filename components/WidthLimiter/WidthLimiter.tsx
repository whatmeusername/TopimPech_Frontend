import styles from './WidthLimiter.module.scss';

export default function WidthLimiter({ children }: { children: JSX.Element }): JSX.Element {
	return <div className={styles.width__limiter}>{children}</div>;
}
