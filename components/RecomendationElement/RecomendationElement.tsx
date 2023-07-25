import { ReactElement } from 'react';
import { useGlobalContext } from '../../context/GlobalContext/GlobalContext';

import './RecomendationElement.scss';
import ProductImageGallery from '../CatalogComponents/HoverGallery/ProductGallery';
import { ProductDataShort } from '../CatalogComponents/Cards/interface';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import Link from 'next/link';

function RecomendationElementCard({ product }: { product: ProductDataShort }): ReactElement {
	return (
		<Link className="recomendation__product__item" href={`/product/${product.article}`} prefetch={false}>
			<div className="recomendation__product__item__image__wrapper">
				<ProductImageGallery images={product.images} urlStartsWith={'/api'} alt={product.name} size={220} />
			</div>
			<div className="recomendation__product__item__info">
				<p className="recomendation__product__item__article">артикул {product.article}</p>
				<p className="recomendation__product__item__name">{product.name}</p>
				<PriceElement product={product} />
			</div>
		</Link>
	);
}
function RecomendationElement({ limit }: { limit?: number }) {
	let recomendationProducts = useGlobalContext().recomendation.data;

	if (limit) {
		recomendationProducts = recomendationProducts.slice(0, limit);
	}

	return (
		<div className="recomendation__products__wrapper">
			<div className="recomendation__products__head">
				<h2 className="recomendation__products__header">Рекомендуем вам</h2>
			</div>
			<div className="recomendation__products__content products__grid__layout">
				{recomendationProducts.map((product) => {
					return <RecomendationElementCard product={product} key={`recomendation__${product.slug}`} />;
				})}
			</div>
		</div>
	);
}

export { RecomendationElement };
