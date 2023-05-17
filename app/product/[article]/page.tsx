import { notFound } from 'next/navigation';
import type { ProductData } from '../../../components/CatalogComponents/Cards/interface';
import { ProductPage } from '../../../components/ProductPage/ProductPage';
import { PAGE_NOT_FOUND, PRODUCT_PAGE_SUB_LABEL, PROXY_URL, ServerSideURLProps, getData } from '../../layout';
import { Metadata } from 'next';

type ServerSideProps = {
	initData: ProductData | null | { status: number; message: any };
};

export async function generateMetadata({ params }: ServerSideURLProps): Promise<Metadata> {
	const product = await getData(PROXY_URL + `products/byarticle/${params.article}`, { cache: 'force-cache' });

	return {
		title: product?.status === 404 ? PAGE_NOT_FOUND : `${product.name} ${PRODUCT_PAGE_SUB_LABEL}`,
	};
}

async function getProductData({ params }: ServerSideURLProps) {
	const serverSideProps: ServerSideProps = { initData: null };
	try {
		serverSideProps['initData'] = await getData(PROXY_URL + `products/byarticle/${params.article}`, { cache: 'force-cache' });
	} catch (err) {
		serverSideProps['initData'] = { status: 404, message: (err as any).message };
	}

	if ((serverSideProps['initData'] as any).status === 404) {
		notFound();
	}

	return serverSideProps;
}

async function ProductPageElement(context: ServerSideURLProps) {
	const { initData } = await getProductData(context);
	return <ProductPage productData={initData as ProductData} params={context.params} />;
}

export default ProductPageElement;
