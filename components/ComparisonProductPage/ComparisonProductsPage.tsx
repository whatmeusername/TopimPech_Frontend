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

function ComparisonProductsPageContent({ initData }: { initData: MappedProductsResponse | null }): ReactElement {
	if (!initData) {
		return <LoadingBar />;
	} else if (initData.count > 0) {
		return (
			<ComparisonProducts config={{ data: initData.data, enableCategoryFilter: true, URLstart: '/api', cards: { show: true, isSticky: true } }} />
		);
	} else {
		return <OptionEmptyPage page={'comparison'} />;
	}
}
function ComparisonProductsPage(): ReactElement {
	// FILLED COMPARISON ICON
	// MOBILE COMPARISON ELEMENT

	const [compariosonData, setCompariosonData] = useState<MappedProductsResponse | null>(null);

	useEffect(() => {
		axios({
			method: 'GET',
			url: 'api/products/session/comparison',
		}).then((res) => {
			setCompariosonData(res.data);
		});
	}, []);

	return (
		<div className="product__comparison__page">
			<div className="product__comparison__page__head">
				<ToPreviousPageButton />
				<h1 className="product__comparison__header">Сравнение товаров</h1>
			</div>

			<ComparisonProductsPageContent initData={compariosonData} />
		</div>
	);
}

export { ComparisonProductsPage };
