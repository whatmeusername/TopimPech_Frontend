import { useState, useContext, memo, useEffect } from 'react';
import useWindowSize from '../../../../hooks/useWindowSize';
import './ChangeProductView.scss';
import { NextRouter, useRouter } from 'next/router';

import List from '../../../../public/CatalogViewIcons/list.svg';
import Grid from '../../../../public/CatalogViewIcons/grid.svg';

const isClient = typeof window !== 'undefined';
type ProductAligmentType = 'row' | 'grid';
interface ProductAligmentVariantData {
	icon: JSX.Element;
	name: ProductAligmentType;
}

const getInitialView = (router: NextRouter, searchParams: URLSearchParams): ProductAligmentType => {
	if (!isClient) {
		return 'row';
	}
	let lsv = localStorage.getItem('view');
	let view = (lsv ?? router.query['view'] ?? 'row') as ProductAligmentType;
	if (!lsv) localStorage.setItem('view', view);
	return view;
};

const ChangeProductView = memo(
	({ disabled, setCatalogView }: { disabled?: boolean; setCatalogView: (...args: any[]) => void }) => {
		const { width } = useWindowSize();
		const router = useRouter();
		const searchParams = isClient ? new URLSearchParams(window.location.search) : ({} as URLSearchParams);
		disabled = disabled === undefined ? false : disabled;

		const [selectedView, setSelectedView] = useState<ProductAligmentType | undefined>(undefined);

		// using useEffect hook to ignore SSR Hydration
		useEffect(() => {
			setSelectedView(getInitialView(router, searchParams));
		}, []);

		const AvailableVariant: ProductAligmentVariantData[] = [
			{ icon: <Grid className="product__view__icon" />, name: 'grid' },
			{ icon: <List className="product__view__icon" />, name: 'row' },
		];

		const setView = (variant: string) => {
			localStorage.setItem('view', variant);
			setCatalogView(variant);
		};

		const getNextView = () => {
			const length = AvailableVariant.length - 1;
			let selectedIndex = AvailableVariant.findIndex((view) => view.name === selectedView);
			if (selectedIndex === length) return AvailableVariant[0];
			else return AvailableVariant[selectedIndex + 1];
		};

		let nextView = getNextView();

		return (
			<div className={`prdouct__views__wrapper ${disabled ? 'prdouct__views__wrapper__disabled' : ''}`}>
				{width === undefined || width >= 1024 ? (
					AvailableVariant.map((variant) => {
						return (
							<div
								className={`prdouct__view ${
									selectedView === variant.name ? 'prdouct__view__selected' : ''
								}`}
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
					>
						<span>:S</span>
					</div>
				)}
			</div>
		);
	},
);

ChangeProductView.displayName = 'ChangeProductView';

export default ChangeProductView;
