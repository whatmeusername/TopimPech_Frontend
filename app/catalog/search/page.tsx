import Catalog from '../../../components/CatalogPage/catalog/index';
import { Metadata } from 'next';

import { ServerSideURLProps } from '../../layout';
import { getCategoryCatalogData } from '../../../appRouteUtils';
import { META_PAGE_DESCRIPTION } from '../../../const/siteinfo.const';

async function CatalogPage(context: ServerSideURLProps) {
	const CatalogData = await getCategoryCatalogData(context);
	return <Catalog CatalogData={CatalogData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Результаты поиска',
		description: META_PAGE_DESCRIPTION('Поиск среди товаров'),
	};
}

export default CatalogPage;
