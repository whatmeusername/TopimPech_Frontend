import Catalog from '../../../components/CatalogPage/catalog/index';
import { Metadata } from 'next';

import { META_PAGE_DESCRIPTION, ServerSideURLProps } from '../../layout';
import { getSearchCatalogData } from '../../../appRouteUtils';

async function CatalogPage(context: ServerSideURLProps) {
	const { initData } = await getSearchCatalogData(context);
	return <Catalog initData={initData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	const description = META_PAGE_DESCRIPTION('Товары для бани');

	return {
		title: 'Результаты поиска',
		description: description,
	};
}

export default CatalogPage;
