import get from 'axios';

import type { ProductData } from '../../../components/CatalogComponents/Cards/interface';
import { ProductPage } from '../../../components/ProductPage/ProductPage';
import { PROXY_URL, ServerSideURLProps } from '../../layout';

type ServerSideProps = {
	initData: ProductData | null | { status: number; message: any };
};

async function getProductData({ params }: ServerSideURLProps) {
	const { article } = params;

	const serverSideProps: ServerSideProps = { initData: null };
	try {
		serverSideProps['initData'] = (await get(PROXY_URL + `products/byarticle/${article}`)).data;
	} catch (err) {
		serverSideProps['initData'] = { status: 404, message: (err as any).message };
	}
	return serverSideProps;
}

async function ProductPageElement(context: ServerSideURLProps) {
	const { initData } = await getProductData(context);
	return <ProductPage initData={initData as ProductData} params={context.params} />;
}

export default ProductPageElement;
