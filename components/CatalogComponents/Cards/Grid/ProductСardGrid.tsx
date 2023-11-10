import AddToCartButton from '../../AddToCartButton/AddToCartButton';
import ProductImageGallery from '../../HoverGallery/ProductGallery';
import PriceElement from '../../PriceElement.tsx/PriceElement';
// import ManufacturerData from '../../other/ManufacturerData';
import ProductCardOptions from '../../other/ProductCardOptions';
import './ProductCardGrid.scss';

import { ProductData } from '../interface';
import Link from 'next/link';
import { ProductPreviewBTN, ProductPreviewModal } from '../../ProductPreview/ProductPreview';
import useToggle from '../../../../hooks/useToggle';
import { ProductCardTags } from '../general';

export default function ProductCardGrid({ product, fadeIn }: { product: ProductData; fadeIn?: boolean }): JSX.Element {
	const [toggled, setToggle] = useToggle(false);
	return (
		<div
			className={`product__card__wrapper product__card__wrapper__grid ${fadeIn ? 'product__card__fade__in' : ''}  ${
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
			<Link href={`/product/${product.slug}/`} className="product__card__link__wrapper" itemProp="url">
				<div className="product__card__image__wrapper">
					<ProductImageGallery images={product.images} urlStartsWith={'/api'} alt={product.name} />
					<ProductPreviewBTN setToggle={setToggle} />
					<ProductCardTags product={product} />
				</div>
				<PriceElement product={product} />
				<div className="product__card__name__wrapper">
					<p className="product__card__name" itemProp="name">
						{product.name}
					</p>
				</div>
				{/* <ManufacturerData product={product} /> */}
			</Link>
			{toggled ? <ProductPreviewModal id={'ProductPreview'} toggle={setToggle} productData={product} /> : null}
			<div className="product__card__no__link__wrapper">
				<AddToCartButton product={product} isContactMode={false} showAvailability={true} />
			</div>
			<ProductCardOptions productData={product} />
		</div>
	);
}
