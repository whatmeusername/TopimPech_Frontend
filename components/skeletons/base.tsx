import './skeletons.scss';

const Skeleton = ({
	children,
	transperent,
	className = '',
}: {
	children?: JSX.Element;
	transperent?: boolean;
	className?: string;
}): JSX.Element => {
	return <div className={`${transperent ? 'skeleteon__transperent' : 'skeleton'} ${className}`}>{children}</div>;
};
const SkeletonItem = ({ className = '' }: { className?: string }) => {
	return <div className={`skeleton__item ${className}`} />;
};

export { Skeleton, SkeletonItem };
