import Catalog from '../../../../components/CatalogPage/catalog/index';

import { Metadata } from 'next';

import { ServerSideURLProps } from '../../../layout';
import { getCategoryCatalogData, getData } from '../../../../appRouteUtils';

import { FilterFetchData } from '../../../../components/CatalogPage/Filter/interface';
import { ProductAPIResponse } from '../../../../components/CatalogPage/catalog/interface';
import { GetCategoryName } from '../../../../utils/GetCategoryName';
import { Page404Metadata } from '../../../../utils/Page404Metadata';
import { CatalogPageMetadata } from '../../../../utils/CatalogPageMetadata';
import { PROXY_URL } from '../../../../const/siteinfo.const';

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

	if (productsData.status.is404Page) return Page404Metadata();
	return CatalogPageMetadata(params, productsData, filtersData);
}

export default CatalogPage;
