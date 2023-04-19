import { GetServerSidePropsContext } from 'next';
import axios, { AxiosResponse } from 'axios';
import { PagePropsContext, PROXY_URL } from '../../../_app';

import Catalog, {
	initData as initDataInterface,
	ProductAPIResponse,
	SearchParamsBuilder,
} from '../../../../components/CatalogPage/catalog/catalog';

function CatalogPage({ initData }: { initData: initDataInterface }) {
	return (
		<PagePropsContext.Provider value={initData}>
			<Catalog initData={initData} />
		</PagePropsContext.Provider>
	);
}

export async function catalogGetServerSideProps(context: GetServerSidePropsContext) {
	const { SearchString } = context.params as { SearchString: string };


	const query = context.query;
	let url = PROXY_URL + 'products/search/';
	if (SearchString) url += `${SearchString}/`;

	let productsData: ProductAPIResponse;

	const [fetchUrl] = SearchParamsBuilder(url, query, 'page', 'items_per_page', 'order', 'filter');

	try {
		const res = (await axios.get(fetchUrl)) as AxiosResponse<ProductAPIResponse>;
		productsData = res.data;
	} catch (err: unknown) {
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

export default CatalogPage;
