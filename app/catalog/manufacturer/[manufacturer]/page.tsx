import Catalog from '../../../../components/CatalogPage/catalog/index';

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
} from '../../../layout';
import { getCategoryCatalogData, getData } from '../../../../appRouteUtils';

import { FilterFetchData } from '../../../../components/CatalogPage/Filter/interface';
import { ProductAPIResponse } from '../../../../components/CatalogPage/catalog/interface';
import { GetCategoryName } from '../../../../utils/GetCategoryName';

async function CatalogPage(context: ServerSideURLProps) {
	context.params.category = 'manufacturer';
	const CatalogData = await getCategoryCatalogData(context);
	CatalogData.pageHeader = GetCategoryName({
		main: 'Товары производителя',
		manufacturer: CatalogData.ManufacturerData?.name,
	});
	return <Catalog CatalogData={CatalogData} isManufacturerPage={true} />;
}

export async function generateMetadata({ params }: ServerSideURLProps): Promise<Metadata> {
	const productFetchURLRaw = `${PROXY_URL}products/filter/manufacturer/${params.manufacturer}`;
	const filtersFetchURLRaw = `${PROXY_URL}products/filters/manufacturer/${params.manufacturer}`;

	const [productsData, filtersData]: [ProductAPIResponse, FilterFetchData] = (await Promise.all([
		getData(productFetchURLRaw, { next: { revalidate: 36000 } }),
		getData(filtersFetchURLRaw, { next: { revalidate: 36000 } }),
	])) as [ProductAPIResponse, FilterFetchData];

	const product = productsData.products?.[0];
	const pageHeader = GetCategoryName({
		main: 'Товары производителя',
		manufacturer: product.manufacturer.name,
		categoryStringAdditions: filtersData.categoryStringAdditions,
		capitalize: true,
	});

	const description = META_PAGE_DESCRIPTION(pageHeader ?? 'товары для бани и дома');
	const ogTitle = productsData.status.is404Page ? 'товары для бани и дома' : `${pageHeader} ${PRODUCT_PAGE_SUB_LABEL}`;

	const result: Metadata = {
		title: productsData.status.is404Page ? PAGE_NOT_FOUND : `${pageHeader} ${PRODUCT_PAGE_SUB_LABEL}`,
		description: description,
		keywords: `${pageHeader}, Купить ${ogTitle} в интернет магазине, цена ${ogTitle}`,
		openGraph: {
			title: ogTitle,
			description: description,
			images: [`${SITE_URL_SLICED}/api${product?.images?.[0]?.path}`],
			url: productsData.status.is404Page ? DOMAIN_NAME : `${FULL_DOMAIN}/catalog/category/${params.category}`,
			...OPENGRAPH_BASE,
		},
	};
	if (!productsData.status.is404Page) {
		result.alternates = { canonical: `/catalog/${params.category}/${params.manufacturer}` };
	}
	return result;
}

export default CatalogPage;
