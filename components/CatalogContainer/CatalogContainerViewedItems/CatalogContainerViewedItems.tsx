import { ReactElement } from 'react';
import { declOfProduct, getItemsPerPage } from '../../../utils';
import { PaginatorData } from '../Paginator/interface';

import './CatalogContainerViewedItems.scss';

function CatalogContainerViewedItems({ PaginatorData }: { PaginatorData: PaginatorData }): ReactElement {
	const viewedItems = getItemsPerPage() * PaginatorData.page;
	return (
		<p className="viewed__products__count">
			Вы просмотрели {viewedItems > PaginatorData.count ? PaginatorData.count : viewedItems} из {PaginatorData.count}{' '}
			{declOfProduct(PaginatorData.count)}
		</p>
	);
}

export { CatalogContainerViewedItems };
