import { ReactElement } from 'react';
import { declOfProduct } from '../../../utils';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';

import { declOfNum } from '../../../utils/decOfNum';

function CatalogHeader({
	content,
	paginator,
	isCounterEnabled,
}: {
	content: string;
	paginator: PaginatorData;
	isCounterEnabled: boolean;
}): ReactElement {
	return (
		<div className="catalog__header__wrapper">
			<h1 className="catalog__header" itemProp="name">
				{content}
			</h1>
			{isCounterEnabled ? (
				<span className="catalog__header__count">
					{paginator.count} {declOfProduct(paginator.count)}
				</span>
			) : null}
		</div>
	);
}

function CatalogHeaderSearch({ paginator, searchString }: { paginator: PaginatorData; searchString: string }): ReactElement {
	return (
		<div className="catalog__header__wrapper catalog__header__search__wrapper">
			<h1 className="catalog__header">
				Результаты поиска по запросу <span className="catalog__header__bold">&quot;{searchString}&quot;</span>
			</h1>
			<span className="catalog__header__count">
				Было {declOfNum(paginator.count, ['найден', 'найдено', 'найдено'])} {paginator.count} {declOfProduct(paginator.count)}
			</span>
		</div>
	);
}

export { CatalogHeader, CatalogHeaderSearch };
