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

import { CatalogHeader, CatalogHeaderSearch } from '../CatalogHead/CatalogHeader';
import { CatalogHead } from '../CatalogHead/CatalogHead';
import { HistorySlider } from '../../HistorySlider/HistorySlider';
import { HydrationComponent } from '../../ProductPage/ProductPage';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { RecomendationElement } from '../../RecomendationElement/RecomendationElement';
import { useProductHistory } from '../../../context/MobxStoreContext/MobxStoreContext';

export interface FetchURLData {
	params: { [K: string]: string };
	query: URLSearchParams;
}

// WAITING FOR NEXT 1.3.4.9 WILL BE RELEASED (GET SCROLL FALSE )
// const getFetchURL = (router: FetchURLData): [string, string] => {
// 	const { category } = router.params;
// 	let url = '/api/products/filter/';
// 	if (category) url += `${category}/`;
// 	return SearchParamsBuilder(url, router.query, 'page', 'items_per_page', 'order', 'filter');
// };

// useEffect(() => {
// 	isLoaded.current = 0;
// 	if (initData?.productsData?.products === undefined) {
// 		axios({
// 			method: 'GET',
// 			url: fetchUrl,
// 		}).then(({ data }: { data: ProductAPIResponse }) => {
// 			setCatalogData(data);
// 			isLoaded.current = 1;
// 		});
// 	} else setCatalogData(initData.productsData);
// 	//eslint-disable-next-line
// }, [maincategory, category, SearchParams]);

// const getFetchURL = (router: FetchURLData): [string, string] => {
// 	const { category } = router.params;
// 	let url = '/api/products/filter/';
// 	if (category) url += `${category}/`;
// 	return SearchParamsBuilder(url, router.query, 'page', 'items_per_page', 'order', 'filter');
// };

function HistoryComponent() {
	const productHistory = useProductHistory();
	if (productHistory.items.length === 0) return null;
	return (
		<>
			<div className="catalog__page__card slider__history__wrapper">
				<h2 className="catalog__page__history__header">Вы смотрели ранее</h2>
				<HistorySlider />
			</div>
			<ThinBreakLine />
		</>
	);
}
export default function Catalog({ initData }: { initData: initData }): ReactElement {
	return (
		<div className="catalog__page__wrapper">
			<CatalogHead>
				<BreadcrumbByURL settings={{ includeHomePage: true }} />
				{initData.isSearch && initData.searchHeader ? (
					<CatalogHeaderSearch searchString={initData.searchHeader} paginator={initData.productsData.paginator} />
				) : (
					<CatalogHeader paginator={initData.productsData.paginator} />
				)}
			</CatalogHead>
			<div className="catalog__body">
				<div className="catalog__filters__wrapper">
					<FacetFilter initialFilters={initData?.filtersData} />
				</div>
				<CatalogContainer CatalogData={initData.productsData} />
			</div>

			<div className="catalog__footer">
				<HydrationComponent>
					<HistoryComponent />
				</HydrationComponent>
				<RecomendationElement limit={12} />
			</div>
		</div>
	);
}
