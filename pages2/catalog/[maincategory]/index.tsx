import { GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { PagePropsContext, PROXY_URL } from '../../_app';

import { FilterFetchData } from '../../../components/CatalogPage/Filter/Filter';
import Catalog from '../../../components/CatalogPage/catalog/index';
import { initData } from '../../../components/CatalogPage/catalog/interface';
import { ProductAPIResponse } from '../../../components/CatalogPage/catalog/interface';
import { SearchParamsBuilder } from '../../../utils';

function CatalogPage({ initData }: { initData: initData }) {
	return (
		<PagePropsContext.Provider value={initData}>
			<Catalog initData={initData} />
		</PagePropsContext.Provider>
	);
}

export async function catalogGetServerSideProps(context: GetServerSidePropsContext) {
	const { maincategory, category } = context.params as { maincategory: string; category: string };
	const query = context.query;

	let produdctFetchURLRaw = PROXY_URL + 'products/filter/';
	if (maincategory) produdctFetchURLRaw += `${maincategory}/`;
	if (category) produdctFetchURLRaw += `${category}/`;

	let filtersFetchURLRaw = PROXY_URL + 'products/filters/';
	if (maincategory) filtersFetchURLRaw += `${maincategory}/`;
	if (category) filtersFetchURLRaw += `${category}/`;

	let productsData: ProductAPIResponse;
	let filtersData: FilterFetchData;

	const [productFetchURL] = SearchParamsBuilder(produdctFetchURLRaw, query, 'page', 'items_per_page', 'order', 'filter');
	const [filterFetchURL] = SearchParamsBuilder(filtersFetchURLRaw, query, 'filter');

	try {
		productsData = (await axios.get(productFetchURL)).data;
		filtersData = (await axios.get(filterFetchURL)).data;
	} catch (err: unknown) {
		productsData = {
			products: [],
			paginator: { previous: false, next: false, page: 0, pages: 0, count: 0 },
			status: { status: 404, message: '', is404Page: true },
		};
		filtersData = { count: 0, filtered: {} };
	}

	return {
		props: {
			initData: {
				productsData: productsData,
				filtersData: filtersData,
				view: query['view'] ?? 'row',
				order: query['order'] ?? 'id',
			},
		},
	};
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	return catalogGetServerSideProps(context);
};

export default CatalogPage;
