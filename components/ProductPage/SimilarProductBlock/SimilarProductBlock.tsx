import get from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { useState, useEffect, ReactElement } from 'react';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import { ComparisonProducts } from '../../ComparisonProducts/ComparisonProducts';

import './SimilarProductBlock.scss';

function SimilarProductBlock({
	article,
	params,
	product,
}: {
	article: string | number;
	params: ParsedUrlQuery;
	product: ProductData;
}): ReactElement | null {
	const [products, setProducts] = useState<ProductData[]>([]);
	useEffect(() => {
		get(`/api/products/similar/${article}`).then((response: any) => {
			setProducts(response.data.data);
		});
	}, [params?.article]);

	if (products.length > 0) {
		return (
			<div className="product__page__card product__page__similar">
				<h3 className="product__page__header__medium">Похожие товары</h3>
				<ComparisonProducts
					config={{
						data: products,
						cards: { show: true },
						enableCategoryFilter: false,
						URLstart: '/api',
						diffWith: product,
						diffLabels: true,
					}}
				/>
			</div>
		);
	} else return null;
}

export { SimilarProductBlock };
