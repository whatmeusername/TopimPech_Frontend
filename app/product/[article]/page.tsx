import { notFound } from 'next/navigation';
import type { ProductData } from '../../../components/CatalogComponents/Cards/interface';
import { ProductPage, ProductPageResponse } from '../../../components/ProductPage/ProductPage';

import { Metadata } from 'next';

import {
	DOMAIN_NAME,
	FULL_DOMAIN,
	META_PAGE_DESCRIPTION,
	OPENGRAPH_BASE,
	PAGE_NOT_FOUND,
	PRODUCT_PAGE_SUB_LABEL,
	PROXY_URL,
	PROXY_URL_SLICED,
	ServerSideURLProps,
	getData,
} from '../../layout';

type ServerSideProps = {
	initData: ProductData | null | { status: number; message: any };
};

export async function generateMetadata({ params }: ServerSideURLProps): Promise<Metadata> {
	const product = (await getData(PROXY_URL + `products/article/${params.article}`, { cache: 'force-cache' })).data;

	const description = META_PAGE_DESCRIPTION(product.name ?? 'товары для бани и дома');
	const ogTitle = product?.status === 404 ? 'товары для бани и дома' : `${product.name} ${PRODUCT_PAGE_SUB_LABEL}`;
	return {
		title: product?.status === 404 ? PAGE_NOT_FOUND : `${product.name} ${PRODUCT_PAGE_SUB_LABEL}`,
		description: description,
		keywords: `${ogTitle}, Купить ${ogTitle}, цена ${ogTitle}, товары для бани и дома`,
		openGraph: {
			title: ogTitle,
			description: description,
			images: [`${PROXY_URL_SLICED}${product?.images?.[0]?.path}`],
			url: product ? `${FULL_DOMAIN}/product/${product.article}` : DOMAIN_NAME,
			...OPENGRAPH_BASE,
		},
	};
}

async function getProductData({ params }: ServerSideURLProps) {
	const serverSideProps: ServerSideProps = { initData: null };
	try {
		serverSideProps['initData'] = await getData(PROXY_URL + `products/article/${params.article}`, { cache: 'force-cache' });
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
	return <ProductPage productData={initData as unknown as ProductPageResponse} params={context.params} />;
}

export default ProductPageElement;
