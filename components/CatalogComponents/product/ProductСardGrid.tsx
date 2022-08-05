import PriceElement from './components/other/PriceElement';
import ManufacturerData from './components/other/ManufacturerData';
import ProductCardOptions from './components/other/ProductCardOptions';
import AddToCartButton from './components/other/AddToCartButton';

import ProductImageGallery from './components/gallery/ProductGallery';

import { ProductData } from './interface';

export default function ProductCardGrid({ product, fadeIn }: { product: ProductData; fadeIn?: boolean }): JSX.Element {
	return (
		<div
			className={`product__card__wrapper product__card__wrapper__grid ${fadeIn ? 'product__card__fade__in' : ''}`}
		>
			<div className="product__card__link__wrapper">
				<div className="product__card__image__wrapper">
					<ProductImageGallery images={product.images} urlStartsWith={'/api'} />
				</div>
				<PriceElement price={product.price} sale={product.sale} />
				<div className="product__card__name__wrapper">
					<span className="product__card__name">{product.name}</span>
				</div>
				<ManufacturerData product={product} />
			</div>
			<div className="product__card__no__link__wrapper">
				<AddToCartButton />
			</div>
			<ProductCardOptions />
		</div>
	);
}
