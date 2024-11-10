import { notFound } from 'next/navigation';
import { ServerSideURLProps } from '../app/layout';
import { ProductAPIResponse, CatalogData } from '../components/CatalogPage/catalog/interface';
import { FilterFetchData } from '../components/CatalogPage/Filter/interface';
import { SearchParamsBuilder } from '../utils';
import { GetCategoryName } from '../utils/GetCategoryName';
import { SiteInfoData } from '../components/HomePageElement/interface';
import { PROXY_URL } from '../const/siteinfo.const';

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

async function getCategoryCatalogData({ params, searchParams }: ServerSideURLProps): Promise<CatalogData> {
	let productFetchURLRaw = `${PROXY_URL}products/filter`;
	let filtersFetchURLRaw = `${PROXY_URL}products/filters`;

	let isSearch: boolean = false;
	let isManufacturerPage = false;
	let product;
	let productsData: ProductAPIResponse;
	let filtersData: FilterFetchData;
	let pageHeader: string = '';
	const CacheLife = 3600;
	const productParamsRest = ['page', 'items_per_page', 'order', 'filter'];
	const filterParamsRest = ['filter'];

	if (!searchParams['search']) {
		if (params.category) {
			productFetchURLRaw += `/${params.category}`;
			filtersFetchURLRaw += `/${params.category}`;
		}
		if (params.manufacturer) {
			productFetchURLRaw += `/${params.manufacturer}`;
			filtersFetchURLRaw += `/${params.manufacturer}`;
			isManufacturerPage = true;
		}
	} else {
		productParamsRest.push('search');
		filterParamsRest.push('search');
		isSearch = true;
	}

	const [productFetchURL] = SearchParamsBuilder(productFetchURLRaw, searchParams, productParamsRest);
	const [filterFetchURL] = SearchParamsBuilder(filtersFetchURLRaw, searchParams, filterParamsRest);

	try {
		[productsData, filtersData] = await Promise.all([
			getData(productFetchURL, { next: { revalidate: CacheLife } }),
			getData(filterFetchURL, { next: { revalidate: CacheLife } }),
		]);

		product = productsData.products?.[0];
		const category = product?.categories?.find((i) => i.slug === filtersData.category);
		pageHeader = GetCategoryName({
			main: isSearch ? searchParams['search'] : category?.name,
			manufacturer: params.manufacturer ? product.manufacturer.name : '',
			categoryStringAdditions: filtersData.categoryStringAdditions,
			capitalize: true,
			isSearch: isSearch,
		});
	} catch (err: unknown) {
		productsData = {
			products: [],
			paginator: { previous: false, next: false, page: 0, pages: 0, count: 0 },
			status: { status: 404, message: '', is404Page: true },
			category: '',
		};
		filtersData = {
			count: 0,
			filtered: {},
			category: '',
			appliedFilters: {},
			categoryStringAdditions: { prefix: '', postfix: '' },
			status: { is404Page: true, status: 404, message: 'page not found' },
		};
	}

	if (productsData.status.is404Page) {
		notFound();
	}

	return {
		productsData: productsData,
		filtersData: filtersData,
		pageHeader: pageHeader,
		order: searchParams['order'] ?? 'id',
		isSearch: isSearch,
		ManufacturerData: isManufacturerPage ? product?.manufacturer : undefined,
		isManufacturerPage: isManufacturerPage,
		params: {
			category: params['category'],
			manufacturer: params['manufacturer'],
		},
	};
}

async function fetchCategories() {
	return getData(`${PROXY_URL}products/categories/`, { next: { revalidate: 604800 } });
}

async function fetchMainInfo(): Promise<SiteInfoData> {
	return getData(`${PROXY_URL}siteinfo/main/`, { next: { revalidate: 604800 } });
}

async function fetchProductsSitemap() {
	return getData(`${PROXY_URL}products/sitemap`, { next: { revalidate: 604800 } });
}

export { getCategoryCatalogData, getData, fetchCategories, fetchProductsSitemap, fetchMainInfo };
