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
	const product: ProductPageResponse = await getData(PROXY_URL + `products/article/${params.article}`, { cache: 'force-cache' });
	const is404 = product?.status.status === 404;

	const description = META_PAGE_DESCRIPTION(is404 ? 'товары для бани и дома' : product.data.name);
	const ogTitle = is404 ? 'товары для бани и дома' : `${product.data.name} ${PRODUCT_PAGE_SUB_LABEL}`;

	let openGraphData = {};
	if (!is404) {
		openGraphData = {
			title: ogTitle,
			description: description,
			images: [`${PROXY_URL_SLICED}${product?.data.images?.[0]?.path}`],
			url: product ? `${FULL_DOMAIN}/product/${product?.data.article}` : DOMAIN_NAME,
			...OPENGRAPH_BASE,
		};
	}

	return {
		title: is404 ? PAGE_NOT_FOUND : `${product.data.name} ${PRODUCT_PAGE_SUB_LABEL}`,
		description: description,
		keywords: `${ogTitle}, Купить ${ogTitle}, цена ${ogTitle}, товары для бани и дома`,
		openGraph: openGraphData,
	};
}

async function getProductData({ params }: ServerSideURLProps): Promise<ProductPageResponse> {
	let ProductPageResponse: ProductPageResponse = null!;
	try {
		ProductPageResponse = await getData(PROXY_URL + `products/article/${params.article}`, { cache: 'no-cache' });
	} catch (err) {
		notFound();
	}

	if (ProductPageResponse?.status.status === 404) {
		notFound();
	}

	return ProductPageResponse;
}

async function ProductPageElement(context: ServerSideURLProps) {
	const ProductPageResponse = await getProductData(context);
	return <ProductPage productData={ProductPageResponse} params={context.params} />;
}

export default ProductPageElement;
