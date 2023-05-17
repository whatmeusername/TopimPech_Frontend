'use client';

import React, { useEffect } from 'react';
import type { ProductData } from '../CatalogComponents/Cards/interface';

import './pp__upper.scss';

import BreadcrumbByURL from '../Shared/breadcrumb/breacrumb';
import Gallery from './Gallery/gallery';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import { ParsedUrlQuery } from 'querystring';

import { productHistory } from '../../store';
import { HydrationComponent } from '../Shared/HydrationComponent/HydrationComponent';
import { AttributesElement, ShortAttributesElement } from './AttributesElement/AttributesElement';

import { SimilarProductBlock } from './SimilarProductBlock/SimilarProductBlock';
import { ManufacturerElement } from './ManufacturerElement/ManufacturerElement';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';
import { HistorySlider } from '../HistorySlider/HistorySlider';

function ProductPage({ productData, params }: { productData: ProductData; params: ParsedUrlQuery }): JSX.Element | null {
	useEffect(() => {
		if (productData && !(productData as any)?.status) {
			productHistory.add(productData);
		}
	}, [params.article]);

	const galleryItems = productData.images.map((img, i) => {
		return { id: i, path: img.path };
	});

	return (
		<div className="product__page__wrapper">
			<div className="product__page__head">
				<div className="product__page__breadcrumb">
					{productData?.categories ? (
						<BreadcrumbByURL
							settings={{
								includeHomePage: true,
								category: productData.categories[productData.categories.length - 1].slug,
								includeAtEnd: {
									label: productData.name,
									slug: productData.slug,
								},
							}}
						/>
					) : null}
				</div>
				<div className="product__page__article__wrapper">
					<span className="product__page__article">Артикул: {productData.article}</span>
				</div>
			</div>
			<div className="product__page__upper">
				<div className="product__page__card product__page__upper__item product__page__gallery__wrapper">
					{galleryItems.length > 0 ? <Gallery items={galleryItems} urlStartsWith={'/api'} ration={3} /> : null}
				</div>
				<div className=" product__page__card product__page__upper__item product__page__main__info">
					<h1 className="product__page__header">{productData.name}</h1>
					<PriceElement price={productData.price} sale={productData.sale} />
					{productData.manufacturer ? <ManufacturerElement ManufacturerData={productData.manufacturer} /> : null}
					<div className="product__page__upper__buttons">
						<AddToCartButton itemId={productData.article} />
					</div>
					{productData.properties && productData.properties?.length > 0 ? (
						<ShortAttributesElement properties={productData.properties} take={5} />
					) : null}
				</div>
			</div>
			<div className=" product__page__card product__page__description">
				<h3 className="product__page__header__medium product__page__description__header">О товаре</h3>
				<span className="product__page__description">{productData.description}</span>
			</div>
			<AttributesElement properties={productData.properties ?? []} />
			<HydrationComponent>
				{productHistory.items.length > 0 ? (
					<div className="product__page__card product__page__history">
						<h3 className="product__page__header__medium">Вы смотрели</h3>
						<HistorySlider excludeArticle={productData.article} />
					</div>
				) : null}
			</HydrationComponent>
			<SimilarProductBlock article={productData.article} URLStartWith={'/api'} params={params} />
		</div>
	);
}

export { HydrationComponent, ProductPage };
