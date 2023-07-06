import get from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { useState, useEffect, ReactElement } from 'react';
import { MappedProductsResponse, ProductData } from '../../CatalogComponents/Cards/interface';
import { ComparisonProducts } from '../../ComparisonProducts/ComparisonProducts';

import './SimilarProductBlock.scss';

function SimilarProductBlock({
	DiffProduct,
	SimilarProductsData,
}: {
	DiffProduct: ProductData;
	SimilarProductsData: MappedProductsResponse;
}): ReactElement | null {
	if (SimilarProductsData.data.length > 0) {
		return (
			<div className="product__page__card product__page__similar">
				<h3 className="product__page__header__medium">Похожие товары</h3>
				<ComparisonProducts
					config={{
						data: SimilarProductsData.data,
						cards: { show: true },
						enableCategoryFilter: false,
						URLstart: '/api',
						diffWith: DiffProduct,
						diffLabels: true,
					}}
				/>
			</div>
		);
	} else return null;
}

export { SimilarProductBlock };
