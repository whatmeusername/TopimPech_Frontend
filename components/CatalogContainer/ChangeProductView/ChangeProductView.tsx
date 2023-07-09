import { useState, memo, useEffect } from 'react';
import useWindowSize from '../../../hooks/useWindowSize';
import './ChangeProductView.scss';

import { CATALOG_VIEW_COOKIE, CatalogView, ProductAligmentVariantData } from './interface';
import { useSearchParams } from 'next/navigation';
import { GridIcon, ListIcon } from '../../IconsElements';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';

const AvailableVariant: ProductAligmentVariantData[] = [
	{ icon: <GridIcon className="product__view__icon" />, name: CatalogView.GRID },
	{ icon: <ListIcon className="product__view__icon" />, name: CatalogView.ROW },
];

const ChangeProductView = memo(({ disabled, setCatalogView }: { disabled?: boolean; setCatalogView: (value: CatalogView) => void }) => {
	const view = useGlobalContext().view;

	const [selectedView, setSelectedView] = useState<CatalogView | undefined>(view);

	const setView = (variant: CatalogView) => {
		document.cookie = `${CATALOG_VIEW_COOKIE}=${variant}`;
		localStorage.setItem('view', variant);
		setCatalogView(variant);
	};

	return (
		<div className={`prdouct__views__wrapper ${disabled ? 'prdouct__views__wrapper__disabled' : ''}`}>
			{AvailableVariant.map((variant) => {
				return (
					<div
						className={`prdouct__view ${selectedView === variant.name ? 'prdouct__view__selected' : ''}`}
						key={variant.name}
						onClick={() => {
							if (!disabled) {
								setSelectedView(variant.name);
								setView(variant.name);
							}
						}}
					>
						{variant.icon}
					</div>
				);
			})}
		</div>
	);
});

ChangeProductView.displayName = 'ChangeProductView';

export { CatalogView };
export default ChangeProductView;
