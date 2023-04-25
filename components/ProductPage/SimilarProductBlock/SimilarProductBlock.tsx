import get from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { useState, useEffect } from 'react';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import { ProductSlider } from '../ProductSlider/ProductSlider';

function SimilarProductBlock({
	article,
	URLStartWith,
	params,
}: {
	article: string | number;
	URLStartWith: string;
	params: ParsedUrlQuery;
}): JSX.Element | null {
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
				<ProductSlider items={products} URLStartWith={URLStartWith} key={products.length} />
			</div>
		);
	} else return null;
}

export { SimilarProductBlock };
