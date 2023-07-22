import Link from 'next/link';

import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { ProductData, ProductDataShort } from '../../CatalogComponents/Cards/interface';
import Slider from '../../Shared/Slider';
import './ProductSlider.scss';
import { ReactElement } from 'react';
import { NO_IMAGE_SRC } from '../../const';

const ProductSliderItem = ({ product, URLStartWith }: { product: ProductData | ProductDataShort; URLStartWith?: string }): ReactElement | null => {
	if (!product) return null;
	const image = product?.images?.[0]?.path;
	return (
		<Link href={`/product/${product.article}`} className="product_slider__item">
			<div className="product_slider__item__image__wrapper">
				<img src={image ? (URLStartWith ?? '') + image : NO_IMAGE_SRC} alt={product.name} className="product_slider__item__image" />
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
}): JSX.Element => {
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
