import { useParams } from 'next/navigation';
import { ReactElement, useMemo } from 'react';
import { declOfNum } from '../../../utils';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';
import { useBreadcrumbContext } from '../../../context/Breadcrumb';
import { useCategoriesContext } from '../../../context/Categories';

function CatalogHeader({ paginator }: { paginator: PaginatorData }): ReactElement {
	const breacrumbData = useBreadcrumbContext();
	const { maincategory, category } = useParams();

	const header = useMemo(() => {
		const currentBreadcrumbItem = breacrumbData?.getEndWith(category);
		if (currentBreadcrumbItem) {
			return currentBreadcrumbItem.data.find((data) => data.slug === category)?.name ?? '';
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
