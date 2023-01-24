import PriceElement from './components/other/PriceElement';
import ManufacturerData from './components/other/ManufacturerData';
import ProductCardOptions from './components/other/ProductCardOptions';
import AddToCartButton from './components/other/AddToCartButton';

import ProductImageGallery from './components/gallery/ProductGallery';
import './ProductCardGrid.scss';

import { ProductData } from './interface';
import Link from 'next/link';

export default function ProductCardGrid({ product, fadeIn }: { product: ProductData; fadeIn?: boolean }): JSX.Element {
	return (
		<div
			className={`product__card__wrapper product__card__wrapper__grid ${fadeIn ? 'product__card__fade__in' : ''}`}
		>
			<Link href={`/product/${product.article}/`} className="product__card__link__wrapper">
				<div className="product__card__image__wrapper">
					<ProductImageGallery images={product.images} urlStartsWith={'/api'} />
				</div>
				<PriceElement price={product.price} sale={product.sale} />
				<div className="product__card__name__wrapper">
					<span className="product__card__name">{product.name}</span>
				</div>
				<ManufacturerData product={product} />
			</Link>
			<div className="product__card__no__link__wrapper">
				<AddToCartButton itemId={product.article} />
			</div>
			<ProductCardOptions />
		</div>
	);
}
