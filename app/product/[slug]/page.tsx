import { notFound } from 'next/navigation';
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
	SITE_URL_SLICED,
	ServerSideURLProps,
} from '../../layout';
import { getData } from '../../../appRouteUtils';
import { Capitalize } from '../../../utils/Capitalize';

export async function generateMetadata({ params }: ServerSideURLProps): Promise<Metadata> {
	const product: ProductPageResponse = await getData(`${PROXY_URL}products/slug/${params.slug}`, { cache: 'force-cache' });
	const is404 = product?.status.status === 404;
	const productName = is404 ? '' : Capitalize(product.data.name);

	const description = META_PAGE_DESCRIPTION(is404 ? 'товары для бани и дома' : productName);
	const ogTitle = is404 ? 'товары для бани и дома' : `${productName} ${PRODUCT_PAGE_SUB_LABEL}`;

	const meta: Metadata = {
		title: is404 ? PAGE_NOT_FOUND : `${productName} ${PRODUCT_PAGE_SUB_LABEL}`,
		description: description,
		keywords: `${productName}, Купить ${ogTitle}, цена ${ogTitle}, товары для бани и дома`,
	};
	if (!is404) {
		meta.openGraph = {
			title: ogTitle,
			description: description,
			images: [`${SITE_URL_SLICED}/api${product?.data.images?.[0]?.path}`],
			url: product ? `${FULL_DOMAIN}/product/${product?.data.article}` : DOMAIN_NAME,
			...OPENGRAPH_BASE,
		};
		meta.alternates = { canonical: `/product/${product.data.slug}` };
	}

	return meta;
}

async function getProductData({ params }: ServerSideURLProps): Promise<ProductPageResponse> {
	let ProductPageResponse: ProductPageResponse = null!;
	try {
		ProductPageResponse = await getData(PROXY_URL + `products/slug/${params.slug}`, { next: { revalidate: 3600 } });
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
