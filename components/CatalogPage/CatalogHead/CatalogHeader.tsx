import { useRouter } from 'next/router';
import { ReactElement, useMemo } from 'react';
import { declOfNum } from '../../../utils';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';
import { useBreadcrumbContext } from '../../../context';

function CatalogHeader({ paginator }: { paginator: PaginatorData }): ReactElement {
	const breacrumbData = useBreadcrumbContext();
	const { maincategory, category } = useRouter().query as { maincategory: string; category: string };

	const header = useMemo(() => {
		const currentBreadcrumbItem = breacrumbData?.get({ start: maincategory, end: category });
		if (currentBreadcrumbItem) {
			const dataFromBreadcrumb = breacrumbData.getUntil(currentBreadcrumbItem, maincategory ?? '', category ?? '');

			const findHeader = category ? category : maincategory;
			return dataFromBreadcrumb.data.find((data) => data.slug === findHeader)?.name ?? '';
		}
	}, [breacrumbData, maincategory, category]);

	return (
		<div className="catalog__header__wrapper">
			<h1 className="catalog__header">{header}</h1>
			<span className="catalog__header__count">
				{paginator.count} {declOfNum(paginator.count, ['товар', 'товара', 'товаров'])}
			</span>
		</div>
	);
}

export { CatalogHeader };
