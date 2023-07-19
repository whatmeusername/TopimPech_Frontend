import { FilterFetchData } from '../../../components/CatalogPage/Filter/Filter';
import Catalog from '../../../components/CatalogPage/catalog/index';

import { ProductAPIResponse } from '../../../components/CatalogPage/catalog/interface';
import { SearchParamsBuilder } from '../../../utils';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
	DOMAIN_NAME,
	FULL_DOMAIN,
	META_PAGE_DESCRIPTION,
	OPENGRAPH_BASE,
	PAGE_NOT_FOUND,
	PRODUCT_PAGE_SUB_LABEL,
	PROXY_URL,
	PROXY_URL_SLICED,
	ServerSideURLProps,
	getData,
} from '../../layout';

//TODO: METADATA;

async function CatalogPage(context: ServerSideURLProps) {
	const { initData } = await catalogGetServerSideProps(context);
	return <Catalog initData={initData} />;
}

export async function generateMetadata({ params, searchParams }: ServerSideURLProps): Promise<Metadata> {
	const searchString = searchParams['search'];
	const productsData: ProductAPIResponse = await getData(`${PROXY_URL}products/filter/?search=${searchString}`, {
		cache: 'force-cache',
		next: { revalidate: 60 },
	});

	const product = productsData.products?.[0];
	const searchResult = searchString ?? 'товары для бани и дома';

	const description = META_PAGE_DESCRIPTION(searchResult);
	const ogTitle = productsData.status.is404Page ? 'товары для бани и дома' : `${searchResult} ${PRODUCT_PAGE_SUB_LABEL}`;

	return {
		title: productsData.status.is404Page ? PAGE_NOT_FOUND : `${searchResult} ${PRODUCT_PAGE_SUB_LABEL}`,
		description: description,
		keywords: `${ogTitle}, Купить ${ogTitle}, цена ${ogTitle}, товары для бани и дома`,
		openGraph: {
			title: ogTitle,
			description: description,
			images: [`${PROXY_URL_SLICED}${product?.images?.[0]?.path}`],
			url: productsData.status.is404Page ? DOMAIN_NAME : `${FULL_DOMAIN}/catalog/search/?search=${searchString}`,
			...OPENGRAPH_BASE,
		},
	};
}

export async function catalogGetServerSideProps({ params, searchParams }: ServerSideURLProps) {
	const productFetchURLRaw = `${PROXY_URL}products/filter/`;
	const filtersFetchURLRaw = `${PROXY_URL}products/filters/`;

	let productsData: ProductAPIResponse;
	let filtersData: FilterFetchData;

	const [productFetchURL] = SearchParamsBuilder(productFetchURLRaw, searchParams, 'page', 'items_per_page', 'order', 'filter', 'search');
	const [filterFetchURL] = SearchParamsBuilder(filtersFetchURLRaw, searchParams, 'filter', 'search');

	try {
		[productsData, filtersData] = await Promise.all([
			getData(productFetchURL, {
				cache: 'no-cache',
			}),
			getData(filterFetchURL, { cache: 'no-cache' }),
		]);
	} catch (err: unknown) {
		productsData = {
			products: [],
			paginator: { previous: false, next: false, page: 0, pages: 0, count: 0 },
			status: { status: 404, message: '', is404Page: true },
		};
		filtersData = { count: 0, filtered: {} };
	}

	if (productsData.status.is404Page) {
		notFound();
	}

	return {
		initData: {
			productsData: productsData,
			filtersData: filtersData,
			order: searchParams['order'] ?? 'id',
			searchHeader: searchParams['search'],
			isSearch: true,
		},
	};
}

export default CatalogPage;
