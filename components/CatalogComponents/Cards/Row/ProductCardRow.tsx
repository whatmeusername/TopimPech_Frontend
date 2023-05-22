import useToggle from '../../../../hooks/useToggle';
import AddToCartButton from '../../AddToCartButton/AddToCartButton';
import ProductImageGallery from '../../HoverGallery/ProductGallery';
import PriceElement from '../../PriceElement.tsx/PriceElement';
import { ProductPreview } from '../../ProductPreview/ProductPreview';
import ManufacturerData from '../../other/ManufacturerData';
import ProductCardOptions from '../../other/ProductCardOptions';
import { ProductData, Property } from './../interface';

import './ProductCardRow.scss';
import Link from 'next/link';

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
		<div className={`product__card__wrapper product__card__wrapper__row ${fadeIn ? 'product__card__fade__in' : ''}`}>
			<div className="product__card__image__wrapper">
				<ProductImageGallery images={product.images} urlStartsWith={'/api'} alt={product.name} />
				<ProductPreview />
			</div>
			<div className="product__card__main__wrapper">
				<Link href={`/product/${product.article}/`} className="product__card__link" prefetch={false}>
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
					<AddToCartButton article={product.article} />
					<ProductCardOptions productData={product} />
				</div>
			</div>
		</div>
	);
}

export default ProductCardRow;
