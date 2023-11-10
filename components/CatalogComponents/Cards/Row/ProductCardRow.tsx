import { ReactElement } from 'react';
import AddToCartButton from '../../AddToCartButton/AddToCartButton';
import ProductImageGallery from '../../HoverGallery/ProductGallery';
import PriceElement from '../../PriceElement.tsx/PriceElement';
import { ProductPreview } from '../../ProductPreview/ProductPreview';
// import ManufacturerData from '../../other/ManufacturerData';
import ProductCardOptions from '../../other/ProductCardOptions';
import { ProductData, Property } from './../interface';

import './ProductCardRow.scss';
import Link from 'next/link';
import { ProductCardTags } from '../general';

const FeatureElement = ({ feature }: { feature: Property }): JSX.Element => {
	return (
		<dl className="product__feature__wrapper">
			<dt className="product__feature__key">{feature.key?.name}</dt>
			<dd className="product__feature__value">
				{feature.value} {feature.key?.valueUnit}
			</dd>
		</dl>
	);
};

const FeatureWrapper = ({ product, limit }: { product: ProductData; limit: number }): ReactElement => {
	const features = (limit ? product.properties?.slice(0, limit) : product.properties) ?? [];
	return (
		<div className="product__features__wrapper">
			{features.map((feature, index) => {
				return <FeatureElement feature={feature} key={`feature-${feature.slug}-${index}`} />;
			})}
		</div>
	);
};

function ProductCardRow({ product, fadeIn }: { product: ProductData; fadeIn?: boolean }): ReactElement {
	return (
		<div
			className={`product__card__wrapper product__card__wrapper__row ${fadeIn ? 'product__card__fade__in' : ''} ${
				!product.available ? 'product__card__wrapper__not__available' : ''
			}`}
			itemProp="itemListElement"
			itemScope
			itemType="https://schema.org/Offer"
		>
			{product.available ? (
				<link itemProp="availability" href="http://schema.org/InStock" />
			) : (
				<link itemProp="availability" href="http://schema.org/OutOfStock" />
			)}
			<div className="product__card__image__wrapper">
				<Link href={`/product/${product.slug}/`} className="product__card__link">
					<ProductImageGallery images={product.images} urlStartsWith={'/api'} alt={product.name} />
				</Link>
				<ProductPreview productData={product} />
			</div>
			<div className="product__card__main__wrapper">
				<Link href={`/product/${product.slug}/`} className="product__card__link" itemProp="url">
					<div className="product__card__info">
						<div className="product__card__name__wrapper">
							<p className="product__card__article">Артикул: {product.article}</p>
							<ProductCardTags product={product} />
							<p className="product__card__name" itemProp="name">
								{product.name}
							</p>
						</div>
						{/* <ManufacturerData product={product} /> */}
						<FeatureWrapper product={product} limit={6} />
					</div>
				</Link>
				<div className="product__card__functions__wrapper">
					<PriceElement product={product} includeMeta={true} />
					<AddToCartButton product={product} isContactMode={false} showAvailability={true} />
					<ProductCardOptions productData={product} />
				</div>
			</div>
		</div>
	);
}

export default ProductCardRow;
