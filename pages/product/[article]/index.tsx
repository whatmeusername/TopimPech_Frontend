import { PagePropsContext, PROXY_URL } from '../../_app';
import get from 'axios';
import { GetServerSidePropsContext } from 'next';
import type { ProductData } from '../../../components/CatalogComponents/product/interface';
import { ProductPageElement } from '../../../components/ProductPage/ProductPage';
import type { ParsedUrlQuery } from 'querystring';

const ProductPage = ({ initData, params }: { initData: ProductData; params: ParsedUrlQuery }) => {
	return (
		<PagePropsContext.Provider value={initData}>
			<ProductPageElement initData={initData} params={params} />
		</PagePropsContext.Provider>
	);
};

type ServerSideProps = {
	initData: ProductData | null | { status: number; message: any };
	params: ParsedUrlQuery | undefined;
};
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const { article } = context.params as { article: string };

	const serverSideProps: ServerSideProps = { initData: null, params: context.params };
	try {
		serverSideProps['initData'] = (await get(PROXY_URL + `products/byarticle/${article}`)).data;
	} catch (err) {
		serverSideProps['initData'] = { status: 404, message: (err as any).message };
	}
	return { props: serverSideProps };
}

export default ProductPage;
