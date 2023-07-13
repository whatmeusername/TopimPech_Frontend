'use client';

import React, { useEffect } from 'react';
import type { MappedProductsResponse, ProductData } from '../CatalogComponents/Cards/interface';

import './pp__upper.scss';

import BreadcrumbByURL from '../Shared/breadcrumb/breacrumb';
import Gallery from './Gallery/gallery';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import { ParsedUrlQuery } from 'querystring';

import { HydrationComponent } from '../Shared/HydrationComponent/HydrationComponent';
import { AttributesElement, ShortAttributesElement } from './AttributesElement/AttributesElement';

import { SimilarProductBlock } from './SimilarProductBlock/SimilarProductBlock';
import { ManufacturerElement } from './ManufacturerElement/ManufacturerElement';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';
import { HistorySlider } from '../HistorySlider/HistorySlider';
import { ComparisonButton } from '../CatalogComponents/ComparisonButton/ComparisonButton';
import { FavouriteButton } from '../CatalogComponents/FavouriteButton/FavouriteButton';
import { useProductHistory } from '../../context/MobxStoreContext/MobxStoreContext';

interface ProductPageResponse {
	data: ProductData;
	similar: MappedProductsResponse;
}

function ProductPage({ productData, params }: { productData: ProductPageResponse; params: ParsedUrlQuery }): JSX.Element | null {
	const productHistory = useProductHistory();
	const product = productData.data;
	const galleryItems = product.images.map((img, i) => {
		return { id: i, path: img.path };
	});

	useEffect(() => {
		if (productData && !(productData as any)?.status) {
			productHistory.add(productData.data);
		}
	}, [params.article]);

	return (
		<div className="product__page__wrapper">
			<div className="product__page__head">
				<div className="product__page__breadcrumb">
					{product?.categories ? (
						<BreadcrumbByURL
							settings={{
								includeHomePage: true,
								category: product.categories[product.categories.length - 1].slug,
								includeAtEnd: {
									label: product.name,
									slug: product.slug,
								},
							}}
						/>
					) : null}
				</div>
				<div className="product__page__article__wrapper">
					<span className="product__page__article">Артикул: {product.article}</span>
				</div>
			</div>
			<div className="product__page__upper">
				<div className="product__page__card product__page__upper__item product__page__gallery__wrapper">
					{galleryItems.length > 0 ? <Gallery items={galleryItems} urlStartsWith={'/api'} ration={3} /> : null}
				</div>
				<div className=" product__page__card product__page__upper__item product__page__main__info">
					<h1 className="product__page__header">{product.name}</h1>
					<PriceElement product={product} />
					{product.manufacturer ? <ManufacturerElement ManufacturerData={product.manufacturer} /> : null}
					<div className="product__page__options__wrapper">
						<AddToCartButton article={product.article} />
						<div className="product__page__options__lower">
							<ComparisonButton productData={product} withLabel={true} useBaseStyle={true} />
							<FavouriteButton productData={product} withLabel={true} useBaseStyle={true} />
						</div>
					</div>
					{product.properties && product.properties?.length > 0 ? (
						<ShortAttributesElement properties={product.properties} take={5} showAllBtn={true} />
					) : null}
				</div>
			</div>
			{product.description ? (
				<div className=" product__page__card product__page__description">
					<h3 className="product__page__header__medium product__page__description__header">О товаре</h3>
					<span className="product__page__description">{product.description}</span>
				</div>
			) : null}
			<AttributesElement properties={product.properties ?? []} />
			<HydrationComponent>
				{productHistory.items.length > 1 ? (
					<div className="product__page__card product__page__history">
						<h3 className="product__page__header__medium">Вы смотрели</h3>
						<HistorySlider excludeArticle={product.article} />
					</div>
				) : null}
			</HydrationComponent>
			<SimilarProductBlock DiffProduct={product} SimilarProductsData={productData.similar} />
		</div>
	);
}

export { HydrationComponent, ProductPage };
export type { ProductPageResponse };
