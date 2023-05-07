'use client';

import React, { useEffect } from 'react';
import type { ProductData } from '../CatalogComponents/Cards/interface';

import './pp__upper.scss';

import BreadcrumbByURL from '../Shared/breadcrumb/breacrumb';
import Gallery from './Gallery/gallery';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import { ParsedUrlQuery } from 'querystring';
import { observer } from 'mobx-react-lite';
import { productHistory } from '../../store';
import { HydrationComponent } from '../Shared/HydrationComponent/HydrationComponent';
import { AttributesElement, ShortAttributesElement } from './AttributesElement/AttributesElement';
import { ProductSlider } from './ProductSlider/ProductSlider';
import { SimilarProductBlock } from './SimilarProductBlock/SimilarProductBlock';
import { ManufacturerElement } from './ManufacturerElement/ManufacturerElement';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';

const HistorySlider = observer(() => {
	return <ProductSlider items={productHistory.items} URLStartWith={'/api'} key={productHistory.items.length} />;
});

function ProductPage({ initData, params }: { initData: ProductData; params: ParsedUrlQuery }): JSX.Element | null {
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
						<AddToCartButton itemId={initData.article} />
					</div>
					{initData.properties && initData.properties?.length > 0 ? <ShortAttributesElement properties={initData.properties} take={5} /> : null}
				</div>
			</div>
			<div className=" product__page__card product__page__description">
				<h3 className="product__page__header__medium product__page__description__header">О товаре</h3>
				<span className="product__page__description">{initData.description}</span>
			</div>
			<AttributesElement properties={initData.properties ?? []} />
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

export { HydrationComponent, ProductPage };
