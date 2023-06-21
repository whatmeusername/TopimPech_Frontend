'use client';

import { ReactElement } from 'react';
import './CatalogContainer.scss';

// ==== NEXT ====
// import { NextRouter } from 'next/router';

// ==== Breadcrumb ====
import BreadcrumbByURL from '../../Shared/breadcrumb/breacrumb';

// ==== Elements =====
import { initData } from './interface';
import { CatalogContainer } from '../../CatalogContainer/index';
import FacetFilter from '../Filter/Filter';

import { CatalogHeader } from '../CatalogHead/CatalogHeader';
import { SearchParamsBuilder } from '../../../utils/SearchParamsBuilder';
import { CatalogHead } from '../CatalogHead/CatalogHead';
import { productHistory } from '../../../store';
import { HistorySlider } from '../../HistorySlider/HistorySlider';
import { HydrationComponent } from '../../ProductPage/ProductPage';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';

export interface FetchURLData {
	params: { [K: string]: string };
	query: URLSearchParams;
}

const getFetchURL = (router: FetchURLData): [string, string] => {
	const { category } = router.params;
	let url = '/api/products/filter/';
	if (category) url += `${category}/`;
	return SearchParamsBuilder(url, router.query, 'page', 'items_per_page', 'order', 'filter');
};

export default function Catalog({ initData }: { initData: initData }): ReactElement {
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
				<CatalogContainer getFetchURL={getFetchURL} CatalogData={initData.productsData} />
			</div>

			<div className="catalog__footer">
				<HydrationComponent>
					{productHistory.items.length > 0 ? (
						<>
							<ThinBreakLine />
							<div className="catalog__page__card catalog__page__history">
								<p className="catalog__page__history__header">Вы смотрели</p>
								<HistorySlider />
							</div>
						</>
					) : null}
				</HydrationComponent>
			</div>
		</div>
	);
}
