import { useParams } from 'next/navigation';
import { ReactElement, useMemo } from 'react';
import { declOfProduct } from '../../../utils';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';
import { useBreadcrumbContext } from '../../../context/Breadcrumb';

import { declOfNum } from '../../../utils/decOfNum';

function CatalogHeader({ paginator }: { paginator: PaginatorData }): ReactElement {
	const breacrumbData = useBreadcrumbContext();
	const { category } = useParams();

	const header = useMemo(() => {
		const currentBreadcrumbItem = breacrumbData?.getEndWith(category);
		if (currentBreadcrumbItem) {
			return currentBreadcrumbItem.data.find((data) => data.slug === category)?.name ?? '';
		}
	}, [breacrumbData, category]);

	return (
		<div className="catalog__header__wrapper">
			<h1 className="catalog__header">{header}</h1>
			<span className="catalog__header__count">
				{paginator.count} {declOfProduct(paginator.count)}
			</span>
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
