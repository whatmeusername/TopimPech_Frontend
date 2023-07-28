import Link from 'next/link';
import { ReactElement } from 'react';
import { ProductDataShort } from '../../CatalogComponents/Cards/interface';
import ProductImageGallery from '../../CatalogComponents/HoverGallery/ProductGallery';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';

import './ProductsGridLayoutItem.scss';

function ProductsGridLayoutItem({ product }: { product: ProductDataShort }): ReactElement {
	product.images.sort((a, b) => a.id - b.id);
	return (
		<Link className="grid__layout__product__item" href={`/product/${product.article}`} prefetch={false}>
			<div className="grid__layout__product__item__image__wrapper">
				<ProductImageGallery images={product.images} urlStartsWith={'/api'} alt={product.name} size={220} />
			</div>
			<div className="grid__layout__product__item__info">
				<p className="grid__layout__product__item__article">артикул {product.article}</p>
				<p className="grid__layout__product__item__name">{product.name}</p>
				<PriceElement product={product} />
			</div>
		</Link>
	);
}

export { ProductsGridLayoutItem };
