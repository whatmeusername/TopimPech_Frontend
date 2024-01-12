import { useState, memo } from 'react';
import './ChangeProductView.scss';

import { CATALOG_VIEW_COOKIE, CatalogView, ProductAligmentVariantData } from './interface';
import { GridIcon, ListIcon } from '../../IconsElements';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';

const AvailableVariant: ProductAligmentVariantData[] = [
	{ icon: <GridIcon className="product__view__icon" />, name: CatalogView.GRID, label: 'Cеткой' },
	{ icon: <ListIcon className="product__view__icon" />, name: CatalogView.ROW, label: 'Cтолбцом' },
];

const ChangeProductView = memo(({ disabled, setCatalogView }: { disabled?: boolean; setCatalogView: (value: CatalogView) => void }) => {
	const view = useGlobalContext().view;

	const [selectedView, setSelectedView] = useState<CatalogView | undefined>(view);

	const setView = (variant: CatalogView) => {
		document.cookie = `${CATALOG_VIEW_COOKIE}=${variant};path=/`;
		localStorage.setItem('view', variant);
		setCatalogView(variant);
	};

	return (
		<div className={`prdouct__views__wrapper ${disabled ? 'prdouct__views__wrapper__disabled' : ''}`}>
			{AvailableVariant.map((variant) => {
				return (
					<button
						className={`prdouct__view ${selectedView === variant.name ? 'prdouct__view__selected' : ''}`}
						key={variant.name}
						onClick={() => {
							if (!disabled) {
								setSelectedView(variant.name);
								setView(variant.name);
							}
						}}
						title={`Раскладка товаров ${variant.label}`}
					>
						<div className="prdouct__view__icon__wrapper">{variant.icon}</div>
						<p className="prdouct__view__label">{variant.label}</p>
					</button>
				);
			})}
		</div>
	);
});

ChangeProductView.displayName = 'ChangeProductView';

export { CatalogView };
export default ChangeProductView;
