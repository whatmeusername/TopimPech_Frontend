'use client';

import React, { ReactElement, useEffect } from 'react';
import type { MappedProductsResponse, ProductData } from '../CatalogComponents/Cards/interface';

import './ProductPage.scss';

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
import parse from 'html-react-parser';
import { ProductsGridLayoutItem } from '../Shared/ProductsGridLayoutItem/ProductsGridLayoutItem';
import { DeliveryIcon, PhoneIcon, SettingsIcon } from '../IconsElements';
import Link from 'next/link';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { observer } from 'mobx-react-lite';
import { ProductCardTags } from '../CatalogComponents/Cards/general';

interface ProductPageResponse {
	data: ProductData;
	similar: MappedProductsResponse;
	status: { status: number; message: any };
}

function SuitableProductsElement({ products }: { products: ProductData[] }): ReactElement {
	return (
		<div className="product__page__suitable__products product__page__card">
			<div className="product__page__suitable__products__header__wrapper">
				<h2 className="product__page__suitable__products__header product__page__header__medium">С данным товаром также покупают</h2>
			</div>
			<div className="product__page__suitable__content products__grid__layout">
				{products.map((product) => {
					return <ProductsGridLayoutItem key={`product__page__suitable__${product.article}`} product={product} />;
				})}
			</div>
		</div>
	);
}

function RelatedProductsElement({ product }: { product: ProductData }): ReactElement {
	const RelatedProductsTable = product.RelatedProductsTable;
	RelatedProductsTable.relatedProducts.sort((a, b) => (a.value < b.value ? -1 : 1));
	return (
		<div className="product__page__related__products__wrapepr">
			<div className="product__page__related__products__header__wrapper">
				<h2 className="product__page__reladeted__products__header">{RelatedProductsTable.key}</h2>
			</div>
			<div className="product__page__related__products__wrapper">
				{RelatedProductsTable.relatedProducts.map((rel) => {
					return (
						<Link
							href={`/product/${rel.product.slug}`}
							key={`related__products__${rel.product.article}`}
							className={`product__page__related__products__link ${
								product.article === rel.product.article ? 'product__page__related__products__link__active' : ''
							} ${rel.product.available === false ? 'product__page__related__products__link__not__available' : ''}`}
						>
							{rel.value}
						</Link>
					);
				})}
			</div>
		</div>
	);
}

function ProductPageMainInfoCard({ product }: { product: ProductData }): ReactElement {
	const galleryItems = product.images.map((img, i) => {
		return { id: i, path: img.path };
	});

	return (
		<div className="product__page__upper">
			<div className="product__page__card product__page__upper __item product__page__gallery__wrapper">
				<Gallery items={galleryItems} urlStartsWith={'/api'} ration={3} productName={product.name} />
			</div>
			<div className=" product__page__card product__page__upper__item product__page__main__info">
				<div className="product__page__article__wrapper__mobile">
					<span className="product__page__article">Артикул: {product.article}</span>
				</div>
				<ProductCardTags product={product} />
				<h1 className="product__page__header" itemProp="name">
					{product.name}
				</h1>
				<span itemProp="offers" itemScope itemType="http://schema.org/Offer">
					{product.available ? (
						<link itemProp="availability" href="http://schema.org/InStock" />
					) : (
						<link itemProp="availability" href="http://schema.org/OutOfStock" />
					)}
					<PriceElement product={product} includeMeta={true} />
					{product.RelatedProductsTable ? <RelatedProductsElement product={product} /> : null}
					{product.manufacturer ? <ManufacturerElement ManufacturerData={product.manufacturer} /> : null}
					<div className="product__page__options__wrapper">
						<AddToCartButton product={product} isContactMode={true} showAvailability={true} />
						<div className="product__page__options__lower">
							<ComparisonButton productData={product} withLabel={true} useBaseStyle={true} />
							<FavouriteButton productData={product} withLabel={true} useBaseStyle={true} />
						</div>
					</div>
					{product.properties && product.properties?.length > 0 ? (
						<ShortAttributesElement properties={product.properties} take={5} showAllBtn={true} />
					) : null}

					<ThinBreakLine />
					<div className="product__page__upper__item__info__wrapper">
						<Link className="product__page__upper__item__wrapper" href={'/info/delivery'}>
							<DeliveryIcon className="product__page__upper__item__icon" />
							<p className="product__page__upper__item__icon__label">О доставке</p>
						</Link>
						<Link className="product__page__upper__item__wrapper" href={'/info/contacts'}>
							<PhoneIcon className="product__page__upper__item__icon" />
							<p className="product__page__upper__item__icon__label">Контакты</p>
						</Link>
						<Link className="product__page__upper__item__wrapper" href={'/info/montage'}>
							<SettingsIcon className="product__page__upper__item__icon" />
							<p className="product__page__upper__item__icon__label">Монтаж</p>
						</Link>
					</div>
				</span>
			</div>
		</div>
	);
}

const ProductPage = observer(({ productData, params }: { productData: ProductPageResponse; params: ParsedUrlQuery }): ReactElement => {
	const productHistory = useProductHistory();
	const product = productData.data;

	useEffect(() => {
		if (productData.status.status !== 404) {
			productHistory.add(productData.data);
		}
	}, [params.article]);

	return (
		<div className="product__page__wrapper">
			<div className="product__page__head">
				{product?.categories ? (
					<BreadcrumbByURL
						category={product.categories[0].slug}
						settings={{
							includeHomePage: true,
							includeAtEnd: {
								label: product.name,
								slug: product.slug,
								href: `/product/${product.slug}`,
							},
						}}
					/>
				) : null}

				<div className="product__page__article__wrapper">
					<span className="product__page__article">Артикул: {product.article}</span>
				</div>
			</div>
			<span itemType="https://schema.org/Product" itemScope className="product__page__content__wrapper">
				<ProductPageMainInfoCard product={product} />
				{product.descriptionDOM ? (
					<div className=" product__page__card product__page__description">
						<h3 className="product__page__header__medium product__page__description__header">О товаре</h3>
						<span className="product__page__description" itemProp="description">
							{parse(product.descriptionDOM)}
						</span>
					</div>
				) : null}
				{product.properties.length > 0 ? <AttributesElement properties={product.properties ?? []} /> : null}

				{product.suitableProducts.length > 0 ? <SuitableProductsElement products={product.suitableProducts} /> : null}
				<SimilarProductBlock DiffProduct={product} SimilarProductsData={productData.similar} />
				<HydrationComponent>
					{productHistory.items.length > 1 ? (
						<div className="product__page__card product__page__history">
							<h3 className="product__page__header__medium">Вы смотрели</h3>
							<HistorySlider excludeArticle={product.article} />
						</div>
					) : null}
				</HydrationComponent>
			</span>
		</div>
	);
});

export { HydrationComponent, ProductPage };
export type { ProductPageResponse };
