import { ReactElement } from 'react';
import { declOfNum, getItemsPerPage } from '../../../utils';
import { PaginatorData } from '../Paginator/interface';

function CatalogContainerViewedItems({ PaginatorData }: { PaginatorData: PaginatorData }): ReactElement {
	return (
		<p className="viewed__products__count">
			Вы просмотрели {getItemsPerPage() * PaginatorData.page} из {PaginatorData.count}{' '}
			{declOfNum(PaginatorData.count, ['товар', 'товаров', 'товаров'])}
		</p>
	);
}

export { CatalogContainerViewedItems };
