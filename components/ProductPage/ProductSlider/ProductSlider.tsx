import Link from 'next/link';

import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { ProductData, ProductDataShort } from '../../CatalogComponents/Cards/interface';
import Slider from '../../Shared/Slider';
import './ProductSlider.scss';
import { ReactElement } from 'react';
import { NO_IMAGE_SRC } from '../../const';

import Image from 'next/image';

const ProductSliderItem = ({ product, URLStartWith }: { product: ProductData | ProductDataShort; URLStartWith?: string }): ReactElement | null => {
	if (!product) return null;
	const image = product?.images?.[0]?.path;
	return (
		<Link href={`/product/${product.slug}`} className="product_slider__item">
			<div className="product_slider__item__image__wrapper">
				<Image
					className="product_slider__item__image"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.srcset = NO_IMAGE_SRC;
						target.src = NO_IMAGE_SRC;
					}}
					unoptimized={image ? image.endsWith('.gif') : false}
					src={image ? (URLStartWith ?? '') + image : NO_IMAGE_SRC}
					alt={product.name}
					width={215}
					height={215}
					style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
				/>
			</div>
			<div className="product_slider__item__info">
				<PriceElement product={product} />
				<span className="product_slider__item__label">{product.name}</span>
			</div>
		</Link>
	);
};

const ProductSlider = ({
	items,
	URLStartWith,
	onClick,
}: {
	items: ProductDataShort[] | ProductData[];
	URLStartWith?: string;
	onClick?: (...args: any[]) => void;
}): ReactElement => {
	return (
		<Slider SliderSettings={{ ItemsPerSlide: 'auto' }}>
			{items.map((item) => {
				return (
					<Slider.Item key={`product_slider__item__${item.article}`} className="product_slider__item__wrapper" onClick={onClick}>
						<ProductSliderItem product={item} URLStartWith={URLStartWith} />
					</Slider.Item>
				);
			})}
		</Slider>
	);
};

export { ProductSliderItem, ProductSlider };
