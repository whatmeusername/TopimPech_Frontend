import Link from 'next/link';

import { HistorySliceItem } from '../../../store';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import Slider from '../../Shared/Slider';
import './ProductSlider.scss';

const ProductSliderItem = ({ data, URLStartWith }: { data: HistorySliceItem | ProductData; URLStartWith?: string }): JSX.Element => {
	const image = Array.isArray((data as ProductData).images) ? (data as any).images[0]?.path : (data as any).image;
	return (
		<Link href={`/product/${data.article}`} className="product_slider__item">
			<div className="product_slider__item__image__wrapper">
				<img src={(URLStartWith ?? '') + image} alt="" className="product_slider__item__image" />
			</div>
			<div className="product_slider__item__info">
				<PriceElement price={data.price} sale={data.sale} />
				<span className="product_slider__item__label">{data.name}</span>
			</div>
		</Link>
	);
};

const ProductSlider = ({ items, URLStartWith }: { items: HistorySliceItem[] | ProductData[]; URLStartWith?: string }): JSX.Element => {
	return (
		<Slider SliderSettings={{ ItemsPerSlide: 'auto' }}>
			<>
				{items.map((item) => {
					return (
						<Slider.Item key={`product_slider__item__${item.article}`} className="product_slider__item__wrapper">
							<ProductSliderItem data={item} URLStartWith={URLStartWith} />
						</Slider.Item>
					);
				})}
			</>
		</Slider>
	);
};

export { ProductSliderItem, ProductSlider };
