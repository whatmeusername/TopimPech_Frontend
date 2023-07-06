import './Number404.scss';

function Number404({ size }: { size: 'icon' | 'small' | 'medium' | 'large' }) {
	return <p className={`number__404__label number__404__size__${size}`}>404</p>;
}

export { Number404 };
