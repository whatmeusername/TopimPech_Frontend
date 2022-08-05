import { useState, useContext, memo } from 'react';
import useWindowSize from '../../../../hooks/useWindowSize';
import styles from './ChangeProductView.module.scss';
import { useRouter } from 'next/router';

import List from '../../../../public/CatalogViewIcons/list.svg';
import Grid from '../../../../public/CatalogViewIcons/grid.svg';

const isClient = typeof window !== 'undefined';

const ChangeProductView = memo(
	({ disabled, setCatalogView }: { disabled?: boolean; setCatalogView: (...args: any[]) => void }) => {
		const { width } = useWindowSize();
		const router = useRouter();
		const searchParams = isClient ? new URLSearchParams(window.location.search) : ({} as URLSearchParams);
		disabled = disabled === undefined ? false : disabled;

		//const ProductSettings = useContext(ProductSettingsContext);
		const [selectedView, setSelectedView] = useState<string>((router.query['view'] as string) ?? 'row');

		const AvailableVariant = [
			{ icon: <Grid className={styles.product__view__icon} />, name: 'grid' },
			{ icon: <List className={styles.product__view__icon} />, name: 'row' },
		];

		const setView = (variant: string) => {
			searchParams.set('view', variant);
			router.push(
				{
					pathname: window.location.pathname,
					query: searchParams.toString(),
				},
				undefined,
				{ shallow: true },
			);
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
			<div
				className={`${styles.prdouct__views__wrapper} ${
					disabled ? styles.prdouct__views__wrapper__disabled : ''
				}`}
			>
				{width === undefined || width >= 1024 ? (
					AvailableVariant.map((variant) => {
						return (
							<div
								className={`${styles.prdouct__view} ${
									selectedView === variant.name ? styles.prdouct__view__selected : ''
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
						className={`${styles.prdouct__view} ${styles.prdouct__view__selected}`}
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
