import Catalog from '../../../components/CatalogPage/catalog/index';
import { Metadata } from 'next';

import { META_PAGE_DESCRIPTION, ServerSideURLProps } from '../../layout';
import { getCategoryCatalogData } from '../../../appRouteUtils';

async function CatalogPage(context: ServerSideURLProps) {
	const CatalogData = await getCategoryCatalogData(context);
	return <Catalog CatalogData={CatalogData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	const description = META_PAGE_DESCRIPTION('Поиск среди товаров');

	return {
		title: 'Результаты поиска',
		description: description,
	};
}

export default CatalogPage;
