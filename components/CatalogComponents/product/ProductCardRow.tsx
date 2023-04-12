import { ProductData, Property } from './interface';

import ProductImageGallery from './components/gallery/ProductGallery';
import PriceElement from './components/other/PriceElement';
import ManufacturerData from './components/other/ManufacturerData';
import ProductCardOptions from './components/other/ProductCardOptions';
import AddToCartButton from './components/other/AddToCartButton';

import './ProductCardRow.scss';
import Link from 'next/link';

const FeatureElement = ({ feature }: { feature: Property }): JSX.Element => {
	return (
		<dl className="product__feature__wrapper">
			<dt className="product__feature__key">{feature.key?.name}</dt>
			<dd className="product__feature__value">
				{feature.value}
				{feature.key?.valueUnit}
			</dd>
		</dl>
	);
};

const FeatureWrapper = ({ product, limit }: { product: ProductData; limit: number }) => {
	const features = (limit ? product.properties?.slice(0, limit) : product.properties) ?? [];
	return (
		<div className="product__features__wrapper">
			{features.map((feature, index) => {
				return <FeatureElement feature={feature} key={`feature-${feature.slug}-${index}`} />;
			})}
		</div>
	);
};

function ProductCardRow({ product, fadeIn }: { product: ProductData; fadeIn?: boolean }): JSX.Element {
	return (
		<div
			className={`product__card__wrapper product__card__wrapper__row ${fadeIn ? 'product__card__fade__in' : ''}`}
		>
			<div className="product__card__image__wrapper">
				<ProductImageGallery images={product?.images} urlStartsWith={'/api'} />
			</div>
			<div className="product__card__main__wrapper">
				<Link href={`/product/${product.article}/`} className="product__card__link">
					<div className="product__card__info">
						<div className="product__card__name__wrapper">
							<span className="product__card__name">{product.name}</span>
						</div>
						<ManufacturerData product={product} />
						<FeatureWrapper product={product} limit={6} />
					</div>
				</Link>
				<div className="product__card__functions__wrapper">
					<PriceElement price={product.price} sale={product.sale} />
					<AddToCartButton itemId={product.article} />
					<ProductCardOptions />
				</div>
			</div>
		</div>
	);
}

export default ProductCardRow;