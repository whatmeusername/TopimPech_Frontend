import { FilterFetchData } from '../../../components/CatalogPage/Filter/Filter';
import Catalog from '../../../components/CatalogPage/catalog/index';

import { ProductAPIResponse } from '../../../components/CatalogPage/catalog/interface';
import { SearchParamsBuilder } from '../../../utils';

import { PAGE_NOT_FOUND, PRODUCT_PAGE_SUB_LABEL, PROXY_URL, ServerSideURLProps, getData } from '../../layout';

import { CatalogView } from '../../../components/CatalogContainer/ChangeProductView/interface';
import { Metadata } from 'next';

async function CatalogPage(context: ServerSideURLProps) {
	const { initData } = await catalogGetServerSideProps(context);
	return <Catalog initData={initData} />;
}

export async function generateMetadata({ params }: ServerSideURLProps): Promise<Metadata> {
	const productsData: ProductAPIResponse = await getData(`${PROXY_URL}products/filter/${params.category}`, { cache: 'force-cache' });
	const category = productsData.products?.[0]?.categories?.find((i) => i.slug === params.category);

	return {
		title: productsData.status.is404Page ? PAGE_NOT_FOUND : `${category?.name} - ${PRODUCT_PAGE_SUB_LABEL}`,
	};
}

export async function catalogGetServerSideProps({ params, searchParams }: ServerSideURLProps) {
	const productFetchURLRaw = `${PROXY_URL}products/filter/${params.category}`;
	const filtersFetchURLRaw = `${PROXY_URL}products/filters/${params.category}`;

	let productsData: ProductAPIResponse;
	let filtersData: FilterFetchData;

	const [productFetchURL] = SearchParamsBuilder(productFetchURLRaw, searchParams, 'page', 'items_per_page', 'order', 'filter');
	const [filterFetchURL] = SearchParamsBuilder(filtersFetchURLRaw, searchParams, 'filter');

	try {
		[productsData, filtersData] = await Promise.all([getData(productFetchURL), getData(filterFetchURL)]);
	} catch (err: unknown) {
		productsData = {
			products: [],
			paginator: { previous: false, next: false, page: 0, pages: 0, count: 0 },
			status: { status: 404, message: '', is404Page: true },
		};
		filtersData = { count: 0, filtered: {} };
	}

	return {
		initData: {
			productsData: productsData,
			filtersData: filtersData,
			view: (searchParams['view'] as CatalogView) ?? CatalogView.ROW,
			order: searchParams['order'] ?? 'id',
		},
	};
}

export default CatalogPage;
