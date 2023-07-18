'use client';

import { ReactElement, useEffect, useState } from 'react';
import { MappedProductsResponse } from '../CatalogComponents/Cards/interface';
import { ComparisonProducts } from '../ComparisonProducts/ComparisonProducts';
import { ToPreviousPageButton } from '../Shared/ToPreviousPageButton/ToPreviousPageButton';

import './ComparisonProductsPage.scss';
import { ComparisonIcon } from '../IconsElements';
import axios from 'axios';
import { LoadingBar } from '../Shared/LoadingBar/LoadingBar';
import { OptionEmptyPage } from '../Shared/OptionEmptyPage/OptionEmptyPage';
import { useComparinsonProducts } from '../../context/MobxStoreContext/MobxStoreContext';
import { HistorySlider } from '../HistorySlider/HistorySlider';

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
function ComparisonProductsPage(): ReactElement {
	const compariosonStore = useComparinsonProducts();

	return (
		<div className="product__comparison__page">
			<div className="product__comparison__page__head">
				<ToPreviousPageButton />
				<h1 className="product__comparison__header">Сравнение товаров</h1>
			</div>

			{compariosonStore.productsArticles.length > 0 ? <ComparisonProductsPageContent /> : <OptionEmptyPage page={'comparison'} />}
			<HistorySlider includeHeader={true} />
		</div>
	);
}

export { ComparisonProductsPage };
