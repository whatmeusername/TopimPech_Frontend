'use client';

import { ReactElement, useEffect, useState } from 'react';
import { MappedProductsResponse } from '../CatalogComponents/Cards/interface';
import { ComparisonProducts } from '../ComparisonProducts/ComparisonProducts';

import './ComparisonProductsPage.scss';
import axios from 'axios';
import { LoadingBar } from '../Shared/LoadingBar/LoadingBar';
import { OptionEmptyPage } from '../Shared/OptionEmptyPage/OptionEmptyPage';
import { useComparinsonProducts } from '../../context/MobxStoreContext/MobxStoreContext';
import { HistorySlider } from '../HistorySlider/HistorySlider';
import { PrimaryPageHeader } from '../Shared/PrimaryPageHeader/PrimaryPageHeader';

function ComparisonProductsPageContent(): ReactElement | null {
	const [compariosonData, setCompariosonData] = useState<MappedProductsResponse | null>(null);

	useEffect(() => {
		axios({
			method: 'GET',
			url: 'api/products/session/comparison',
		}).then((res) => {
			setCompariosonData(res.data);
		});
	}, []);

	if (!compariosonData) {
		return <LoadingBar />;
	} else if (compariosonData.count > 0) {
		return (
			<ComparisonProducts
				config={{ data: compariosonData.data, enableCategoryFilter: true, URLstart: '/api', cards: { show: true, isSticky: true, canDelete: true } }}
			/>
		);
	}
	return null;
}
const ComparisonProductsPage = (): ReactElement => {
	const compariosonStore = useComparinsonProducts();

	return (
		<div className="product__comparison__page">
			<PrimaryPageHeader header={'Сравнение товаров'} />
			{compariosonStore.productsArticles.length > 0 ? <ComparisonProductsPageContent /> : <OptionEmptyPage page={'comparison'} />}
			<HistorySlider includeHeader={true} />
		</div>
	);
};

export { ComparisonProductsPage };
