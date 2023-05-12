import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindowSize';
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
	const windowSize = useWindowSize();
	const width = windowSize.width ?? window.innerWidth;
	let itemsPerSlide = 6;

	if (width) {
		if (width < 400) itemsPerSlide = 1;
		else if (width < 600) itemsPerSlide = 2;
		else if (width < 800) itemsPerSlide = 3;
		else if (width < 1000) itemsPerSlide = 4;
		else if (width < 1200) itemsPerSlide = 5;
	}

	return (
		<Slider SliderSettings={{ ItemsPerSlide: itemsPerSlide }}>
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
