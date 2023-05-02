import { useState, memo, useEffect } from 'react';
import useWindowSize from '../../../hooks/useWindowSize';
import './ChangeProductView.scss';
import { NextRouter, useRouter } from 'next/router';

import List from '../../../public/CatalogViewIcons/list.svg';
import Grid from '../../../public/CatalogViewIcons/grid.svg';
import { CatalogView, ProductAligmentVariantData } from './interface';

const getInitialView = (router: NextRouter): CatalogView => {
	if (typeof window === 'undefined') return CatalogView.ROW;

	const lsv = localStorage.getItem('view');
	const view = (lsv ?? router.query['view'] ?? CatalogView.ROW) as CatalogView;
	if (!lsv) localStorage.setItem('view', view);
	return view;
};

const AvailableVariant: ProductAligmentVariantData[] = [
	{ icon: <Grid className="product__view__icon" />, name: CatalogView.GRID },
	{ icon: <List className="product__view__icon" />, name: CatalogView.ROW },
];

const ChangeProductView = memo(({ disabled, setCatalogView }: { disabled?: boolean; setCatalogView: (value: CatalogView) => void }) => {
	const { width } = useWindowSize();
	const router = useRouter();

	const [selectedView, setSelectedView] = useState<CatalogView | undefined>(undefined);

	useEffect(() => {
		setSelectedView(getInitialView(router));
	}, []);

	const setView = (variant: CatalogView) => {
		localStorage.setItem('view', variant);
		setCatalogView(variant);
	};

	const getNextView = () => {
		const selectedIndex = AvailableVariant.findIndex((view) => view.name === selectedView);
		return selectedIndex === AvailableVariant.length - 1 ? AvailableVariant[0] : AvailableVariant[selectedIndex + 1];
	};

	const nextView = getNextView();

	return (
		<div className={`prdouct__views__wrapper ${disabled ? 'prdouct__views__wrapper__disabled' : ''}`}>
			{width === undefined || width >= 1024 ? (
				AvailableVariant.map((variant) => {
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
				})
			) : (
				<div
					className="prdouct__view prdouct__view__selected"
					onClick={() => {
						if (!disabled) {
							setSelectedView(nextView.name);
							setView(nextView.name);
						}
					}}
				></div>
			)}
		</div>
	);
});

ChangeProductView.displayName = 'ChangeProductView';

export { getInitialView, CatalogView };
export default ChangeProductView;
