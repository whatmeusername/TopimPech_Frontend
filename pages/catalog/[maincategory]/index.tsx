import { createContext, useContext } from 'react';

import Catalog, {
	initData as initDataInterface,
	ProductAPIResponse,
	SearchParamsBuilder,
} from '../../../components/CatalogPage/catalog/catalog';
import { GetServerSidePropsContext } from 'next';
import axios, { AxiosResponse } from 'axios';
import { PROXY_URL } from '../../_app';

export const PagePropsContext = createContext<initDataInterface>(null!);
export const usePagePropsContext = () => {
	return useContext(PagePropsContext);
};

function CatalogPage({ initData }: { initData: initDataInterface }) {
	return (
		<PagePropsContext.Provider value={initData}>
			<Catalog initData={initData} />
		</PagePropsContext.Provider>
	);
}

export default CatalogPage;

export async function catalogGetServerSideProps(context: GetServerSidePropsContext) {
	const { maincategory, category } = context.params as { maincategory: string; category: string };
	const query = context.query;
	let url = PROXY_URL + 'products/filter/';
	if (maincategory) url += `${maincategory}/`;
	if (category) url += `${category}/`;

	let productsData: ProductAPIResponse;

	const [fetchUrl] = SearchParamsBuilder(url, query, 'page', 'items_per_page', 'order', 'filter');

	try {
		let res = (await axios.get(fetchUrl)) as AxiosResponse<ProductAPIResponse>;
		productsData = res.data;
	} catch (err) {
		productsData = {
			products: [],
			paginator: { previous: false, next: false, page: 0, pages: 0, count: 0 },
			status: { status: 404, message: '', is404Page: true },
		};
	}

	return {
		props: {
			initData: {
				productsData: productsData,
				filters: {},
				view: query['view'] ?? 'row',
				order: query['order'] ?? 'id',
			},
		},
	};
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	return catalogGetServerSideProps(context);
};
