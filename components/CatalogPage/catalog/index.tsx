import { ReactElement } from 'react';
import './CatalogContainer.scss';

// ==== NEXT ====
import { NextRouter } from 'next/router';

// ==== Breadcrumb ====
import BreadcrumbByURL from '../../Shared/breadcrumb/breacrumb';

// ==== Elements =====
import { initData } from './interface';
import { CatalogContainer } from '../../CatalogContainer';
import FacetFilter from '../Filter/Filter';
import { ProductsNotFound } from '../ProductsNotFound/ProductsNotFound';
import { CatalogHead } from '../CatalogHead/CatalogHead';
import { CatalogHeader } from '../CatalogHead/CatalogHeader';
import { SearchParamsBuilder } from '../../../utils/SearchParamsBuilder';

const getFetchURL = (router: NextRouter): [string, string] => {
	const { maincategory, category } = router.query as { maincategory: string; category: string };
	let url = '/api/products/filter/';
	if (maincategory) url += `${maincategory}/`;
	if (category) url += `${category}/`;
	return SearchParamsBuilder(url, router.query, 'page', 'items_per_page', 'order', 'filter');
};

export default function Catalog({ initData }: { initData: initData }): ReactElement {
	if (!initData?.productsData?.status?.is404Page) {
		return (
			<div className="catalog__page__wrapper">
				<CatalogHead>
					<BreadcrumbByURL settings={{ includeHomePage: true }} />
					<CatalogHeader paginator={initData.productsData.paginator} />
				</CatalogHead>
				<div className="catalog__body">
					<div className="catalog__filters__wrapper">
						<FacetFilter initialFilters={initData?.filtersData} />
					</div>
					<CatalogContainer getFetchURL={getFetchURL} />
				</div>
			</div>
		);
	} else {
		return <ProductsNotFound />;
	}
}
