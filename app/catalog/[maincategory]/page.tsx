import { FilterFetchData } from '../../../components/CatalogPage/Filter/Filter';
import Catalog from '../../../components/CatalogPage/catalog/index';

import { ProductAPIResponse } from '../../../components/CatalogPage/catalog/interface';
import { SearchParamsBuilder } from '../../../utils';

import { PROXY_URL, ServerSideURLProps, getData } from '../../layout';

import { CatalogView } from '../../../components/CatalogContainer/ChangeProductView/interface';

async function CatalogPage(context: ServerSideURLProps) {
	const { initData } = await catalogGetServerSideProps(context);
	return <Catalog initData={initData} />;
}

export async function catalogGetServerSideProps({ params, searchParams }: ServerSideURLProps) {
	const { maincategory, category } = params;

	let produdctFetchURLRaw = PROXY_URL + 'products/filter/';
	if (maincategory) produdctFetchURLRaw += `${maincategory}/`;
	if (category) produdctFetchURLRaw += `${category}/`;

	let filtersFetchURLRaw = PROXY_URL + 'products/filters/';
	if (maincategory) filtersFetchURLRaw += `${maincategory}/`;
	if (category) filtersFetchURLRaw += `${category}/`;

	let productsData: ProductAPIResponse;
	let filtersData: FilterFetchData;

	const [productFetchURL] = SearchParamsBuilder(produdctFetchURLRaw, searchParams, 'page', 'items_per_page', 'order', 'filter');
	const [filterFetchURL] = SearchParamsBuilder(filtersFetchURLRaw, searchParams, 'filter');

	try {
		[productsData, filtersData] = await Promise.all([getData(productFetchURL, { cache: 'no-store' }), getData(filterFetchURL, { cache: 'reload' })]);
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
