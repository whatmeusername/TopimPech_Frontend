import { notFound } from 'next/navigation';
import { ServerSideURLProps, PROXY_URL } from '../app/layout';
import { ProductAPIResponse } from '../components/CatalogPage/catalog/interface';
import { FilterFetchData } from '../components/CatalogPage/Filter/interface';
import { SearchParamsBuilder } from '../utils';

async function getData(url: string, init?: RequestInit) {
	const res = fetch(url, init)
		.then((res) => {
			return res.json();
		})
		.catch(() => {
			return undefined;
		});
	return res;
}

async function getCategoryCatalogData({ params, searchParams }: ServerSideURLProps) {
	const productFetchURLRaw = `${PROXY_URL}products/filter/${params.category}`;
	const filtersFetchURLRaw = `${PROXY_URL}products/filters/${params.category}`;

	let productsData: ProductAPIResponse;
	let filtersData: FilterFetchData;

	const [productFetchURL] = SearchParamsBuilder(productFetchURLRaw, searchParams, 'page', 'items_per_page', 'order', 'filter');
	const [filterFetchURL] = SearchParamsBuilder(filtersFetchURLRaw, searchParams, 'filter');

	try {
		[productsData, filtersData] = await Promise.all([
			getData(productFetchURL, {
				cache: 'reload',
			}),
			getData(filterFetchURL, { next: { revalidate: 3600 } }),
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
			isSearch: false,
		},
	};
}

async function getSearchCatalogData({ searchParams }: ServerSideURLProps) {
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

async function fetchCategories() {
	return getData(`${PROXY_URL}products/categories/`, { next: { revalidate: 3600 } });
}

async function fetchProductsSitemap() {
	return getData(`${PROXY_URL}products/sitemap`, { next: { revalidate: 604800 } });
}

export { getCategoryCatalogData, getSearchCatalogData, getData, fetchCategories, fetchProductsSitemap };
