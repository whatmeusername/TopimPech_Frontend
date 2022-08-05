import styles from './skeletons.module.scss';

const Skeleton = ({
	children,
	transperent,
	className = '',
}: {
	children?: JSX.Element;
	transperent?: boolean;
	className?: string;
}): JSX.Element => {
	return (
		<div className={`${transperent ? styles.skeleteon__transperent : styles.skeleton} ${styles[className]}`}>
			{children}
		</div>
	);
};
const SkeletonItem = ({ className = '' }: { className?: string }) => {
	return <div className={`${styles.skeleton__item} ${styles[className]}`} />;
};

export { Skeleton, SkeletonItem };
