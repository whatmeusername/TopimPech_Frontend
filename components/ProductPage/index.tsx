import { useEffect, useState, ReactElement } from 'react';
import type { ProductData } from '../CatalogComponents/product/interface';

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
					<BreadcrumbByURL
						settings={{
							includeHomePage: true,
							categoryData: {
								maincategory: initData.MainCategory.slug,
								category: initData.categories?.[initData.categories.length - 1]?.slug ?? '',
							},
							includeAtEnd: {
								label: initData.name,
								slug: initData.slug,
							},
						}}
					/>
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
					<div className="product__page__upper__buttons">
						<AddToCartButton itemId={initData.article} />
					</div>
				</div>
			</div>
			<div className=" product__page__card product__page__description">
				<h3 className="product__page__header__medium product__page__description__header">Описание</h3>
				<span className="product__page__description">{initData.description}</span>
			</div>
			<div className=" product__page__card product__page__properties">
				<h3 className="product__page__header__medium product__page__properties__header">Характеристика</h3>
				<div className="product__page__properties__content">
					{(initData.properties ?? []).map((prop) => {
						if (!prop.key) return null;
						return (
							<dl key={`product__properties__${prop.key.slug}`} className="product__page__properties__item">
								<dt className="product__page__properties__item__key">{prop.key.name}</dt>
								<dd className="product__page__properties__item__value">
									{prop.value} {prop.key.valueUnit}
								</dd>
							</dl>
						);
					})}
				</div>
			</div>
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
