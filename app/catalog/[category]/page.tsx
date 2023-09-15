import Catalog from '../../../components/CatalogPage/catalog/index';

import { ProductAPIResponse } from '../../../components/CatalogPage/catalog/interface';

import { Metadata } from 'next';

import {
	DOMAIN_NAME,
	FULL_DOMAIN,
	META_PAGE_DESCRIPTION,
	OPENGRAPH_BASE,
	PAGE_NOT_FOUND,
	PRODUCT_PAGE_SUB_LABEL,
	PROXY_URL,
	SITE_URL_SLICED,
	ServerSideURLProps,
} from '../../layout';
import { getCategoryCatalogData, getData } from '../../../appRouteUtils';
import { Capitalize } from '../../../utils/Capitalize';

async function CatalogPage(context: ServerSideURLProps) {
	const { initData } = await getCategoryCatalogData(context);
	return <Catalog initData={initData} />;
}

export async function generateMetadata({ params }: ServerSideURLProps): Promise<Metadata> {
	const productsData: ProductAPIResponse = await getData(`${PROXY_URL}products/filter/${params.category}`, {
		cache: 'force-cache',
	});

	const product = productsData.products?.[0];
	const category = product?.categories?.find((i) => i.slug === params.category);
	const categoryName = category ? Capitalize(category.name) : '';
	const categorySlug = category?.slug ?? '';

	const description = META_PAGE_DESCRIPTION(categoryName ?? 'товары для бани и дома');
	const ogTitle = productsData.status.is404Page ? 'товары для бани и дома' : `${categoryName} ${PRODUCT_PAGE_SUB_LABEL}`;

	const result: Metadata = {
		title: productsData.status.is404Page ? PAGE_NOT_FOUND : `${categoryName} ${PRODUCT_PAGE_SUB_LABEL}`,
		description: description,
		keywords: `${categoryName}, Купить ${ogTitle} в интернет магазине, цена ${ogTitle}`,
		openGraph: {
			title: ogTitle,
			description: description,
			images: [`${SITE_URL_SLICED}/api${product?.images?.[0]?.path}`],
			url: productsData.status.is404Page ? DOMAIN_NAME : `${FULL_DOMAIN}/catalog/category/${categorySlug}`,
			...OPENGRAPH_BASE,
		},
	};
	if (!productsData.status.is404Page) {
		result.alternates = { canonical: `/catalog/${categorySlug}` };
	}
	return result;
}

export default CatalogPage;
