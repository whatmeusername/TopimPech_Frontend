import Link from 'next/link';
import useWindowSize from '../../../hooks/useWindowSize';
import { HistorySliceItem } from '../../../store';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import Slider from '../../Shared/Slider';

const ProductSliderItem = ({ data, URLStartWith }: { data: HistorySliceItem | ProductData; URLStartWith?: string }): JSX.Element => {
	const image = Array.isArray((data as ProductData).images) ? (data as any).images[0]?.path : (data as any).image;
	return (
		<Link href={`/product/${data.article}`} className="history__item">
			<div className="history__item__image__wrapper">
				<img src={(URLStartWith ?? '') + image} alt="" className="history__item__image" />
			</div>
			<div className="history__item__info">
				<PriceElement price={data.price} sale={data.sale} />
				<span className="history__item__label">{data.name}</span>
			</div>
		</Link>
	);
};

const ProductSlider = ({ items, URLStartWith }: { items: HistorySliceItem[] | ProductData[]; URLStartWith: string }): JSX.Element => {
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
						<Slider.Item key={`history__item__${item.article}`}>
							<ProductSliderItem data={item} URLStartWith={URLStartWith} />
						</Slider.Item>
					);
				})}
			</>
		</Slider>
	);
};

export { ProductSliderItem, ProductSlider };
