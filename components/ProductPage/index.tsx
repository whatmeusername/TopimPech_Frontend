import { useEffect, useState, ReactElement } from 'react';
import type { ProductBaseData, ProductData } from '../CatalogComponents/product/interface';

import './pp__upper.scss';

import BreadcrumbByURL from '../CatalogComponents/breadcrumb/breacrumb';
import Gallery from './gallery';
import Slider from '../Slider';
import PriceElement from '../CatalogComponents/product/components/other/PriceElement';
import AddToCartButton from '../CatalogComponents/product/components/other/AddToCartButton';
import Link from 'next/link';
import useWindowSize from '../../hooks/useWindowSize';
import get from 'axios';
import { ParsedUrlQuery } from 'querystring';
import { observer } from 'mobx-react-lite';
import { HistorySliceItem, productHistory } from '../../store';
import { Property } from '../CatalogComponents/product/interface';
import React from 'react';

const ProductSliderItem = ({
	data,
	URLStartWith,
}: {
	data: HistorySliceItem | ProductData;
	URLStartWith?: string;
}): JSX.Element => {
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

const ProductSlider = ({
	items,
	URLStartWith,
}: {
	items: HistorySliceItem[] | ProductData[];
	URLStartWith: string;
}): JSX.Element => {
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

function SimilarProductBlock({
	article,
	URLStartWith,
	params,
}: {
	article: string | number;
	URLStartWith: string;
	params: ParsedUrlQuery;
}): JSX.Element | null {
	const [products, setProducts] = useState<ProductData[]>([]);
	useEffect(() => {
		get(`/api/products/similar/${article}`).then((response) => {
			setProducts(response.data.data);
		});
	}, [params?.article]);

	if (products.length > 0) {
		return (
			<div className="product__page__card product__page__similar">
				<h3 className="product__page__header__medium">Похожие товары</h3>
				<ProductSlider items={products} URLStartWith={URLStartWith} key={products.length} />
			</div>
		);
	} else return null;
}

const HistorySlider = observer(() => {
	return <ProductSlider items={productHistory.items} URLStartWith={'/api'} key={productHistory.items.length} />;
});

const ManufacturerElement = ({ ManufacturerData }: { ManufacturerData: ProductBaseData }) => {
	return (
		<div className="product__page__manufacturer">
			<span className="product__page__manufacturer__label">Производитель:</span>
			<span className="product__page__manufacturer__name">{ManufacturerData.name}</span>
		</div>
	);
};

const AttributeElement = ({ item }: { item: Property }): ReactElement => {
	return (
		<dl key={`product__properties__${item.key.slug}`} className="product__page__properties__item">
			<dt className="product__page__properties__item__key">{item.key.name}</dt>
			<dd className="product__page__properties__item__value">
				{item.value} {item.key.valueUnit}
			</dd>
		</dl>
	);
};

const AttributesElement = ({ properties }: { properties: Property[] }): ReactElement => {
	return (
		<div className=" product__page__card product__page__properties" id="product__page__properties">
			<h3 className="product__page__header__medium product__page__properties__header">Характеристика</h3>
			<div className="product__page__properties__content">
				{properties.map((prop) => {
					if (!prop.key) return null;
					return <AttributeElement item={prop} key={`product__properties__${prop.key.slug}`} />;
				})}
			</div>
		</div>
	);
};

function smoothScrollToAnchor(anchor: string, duration: number) {
	const target: HTMLElement = document.querySelector(anchor) as HTMLElement;

	if (target) {
		const startPosition = window.pageYOffset;
		const targetPosition = target.offsetTop;
		const distance = targetPosition - startPosition;

		let start: number | null = null;

		const easeInOutQuad = (t: number) => {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		};

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = timestamp - start;
			const easing = easeInOutQuad(progress / duration);
			window.scrollTo(0, startPosition + distance * easing);
			if (progress < duration) {
				window.requestAnimationFrame(step);
			}
		};

		window.requestAnimationFrame(step);
	}
}

function ShortAttributesElement({ properties, take }: { properties: Property[]; take: number }): ReactElement {
	return (
		<div className="product__page__properties__short">
			<h5 className="product__page__properties__short__header">Характеристики:</h5>
			<div className="product__page__properties__short__content">
				{properties.slice(0, take).map((prop) => {
					if (!prop.key) return null;
					return <AttributeElement item={prop} key={`product__properties__${prop.key.slug}`} />;
				})}
			</div>
			{properties.length > take ? (
				<button
					className="product__page__properties__short__show__all"
					onClick={(event: React.MouseEvent) => {
						smoothScrollToAnchor('#product__page__properties', 500);
					}}
				>
					Показать все характеристики
				</button>
			) : null}
		</div>
	);
}

function ProductPageElement({
	initData,
	params,
}: {
	initData: ProductData;
	params: ParsedUrlQuery;
}): JSX.Element | null {
	useEffect(() => {
		if (initData && !(initData as any)?.status) {
			productHistory.add(initData);
		}
	}, [params.article]);

	if (!initData || (initData as any)?.status === 404) return null;

	const galleryItems = initData.images.map((img, i) => {
		return { id: i, path: img.path };
	});

	return (
		<div className="product__page__wrapper">
			<div className="product__page__head">
				<div className="product__page__breadcrumb">
					{initData?.categories ? (
						<BreadcrumbByURL
							settings={{
								includeHomePage: true,
								categoryData: {
									maincategory: initData.categories[0].slug,
									category: initData.categories[initData.categories.length - 1].slug,
								},
								includeAtEnd: {
									label: initData.name,
									slug: initData.slug,
								},
							}}
						/>
					) : null}
				</div>
				<div className="product__page__article__wrapper">
					<span className="product__page__article">Артикул: {initData.article}</span>
				</div>
			</div>
			<div className="product__page__upper">
				<div className="product__page__card product__page__upper__item product__page__gallery__wrapper">
					{galleryItems.length > 0 ? <Gallery items={galleryItems} urlStartsWith={'/api'} ration={3} /> : null}
				</div>
				<div className=" product__page__card product__page__upper__item product__page__main__info">
					<h1 className="product__page__header">{initData.name}</h1>
					<PriceElement price={initData.price} sale={initData.sale} />
					{initData.manufacturer ? <ManufacturerElement ManufacturerData={initData.manufacturer} /> : null}
					<div className="product__page__upper__buttons">
						<HydrationComponent>
							<AddToCartButton itemId={initData.article} />
						</HydrationComponent>
					</div>
					{initData.properties && initData.properties?.length > 0 ? (
						<ShortAttributesElement properties={initData.properties} take={5} />
					) : null}
				</div>
			</div>
			<div className=" product__page__card product__page__description">
				<h3 className="product__page__header__medium product__page__description__header">О товаре</h3>
				<span className="product__page__description">{initData.description}</span>
			</div>
			<AttributesElement properties={initData.properties ?? []} />
			{/* // TODO: SUPPRESESS HYDRATION */}
			<HydrationComponent>
				<div suppressHydrationWarning className="product__page__card product__page__history">
					<h3 className="product__page__header__medium">Вы смотрели</h3>
					{productHistory.items.length > 0 ? <HistorySlider /> : null}
				</div>
			</HydrationComponent>
			<SimilarProductBlock article={initData.article} URLStartWith={'/api'} params={params} />
		</div>
	);
}

const HydrationComponent = ({ children, still }: { children: ReactElement; still?: boolean }) => {
	const [ssr, setSSR] = useState(false);
	useEffect(() => {
		setSSR(true);
	});

	if (ssr || still) {
		return <>{children}</>;
	} else {
		return null;
	}
};

export default ProductPageElement;
