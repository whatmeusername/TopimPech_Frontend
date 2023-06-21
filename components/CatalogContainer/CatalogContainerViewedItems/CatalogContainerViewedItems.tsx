import { ReactElement } from 'react';
import { declOfProduct, getItemsPerPage } from '../../../utils';
import { PaginatorData } from '../Paginator/interface';

import './CatalogContainerViewedItems.scss';

function CatalogContainerViewedItems({ PaginatorData }: { PaginatorData: PaginatorData }): ReactElement {
	return (
		<p className="viewed__products__count">
			Вы просмотрели {getItemsPerPage() * PaginatorData.page} из {PaginatorData.count} {declOfProduct(PaginatorData.count)}
		</p>
	);
}

export { CatalogContainerViewedItems };
