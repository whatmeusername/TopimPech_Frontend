'use client';

import { ReactElement } from 'react';
import './CatalogContainer.scss';

// ==== NEXT ====
// import { NextRouter } from 'next/router';

// ==== Breadcrumb ====
import BreadcrumbByURL from '../../Shared/breadcrumb/breacrumb';

// ==== Elements =====
import { CatalogData } from './interface';
import { CatalogContainer } from '../../CatalogContainer/index';
import FacetFilter from '../Filter/Filter';

import { CatalogHeader, CatalogHeaderSearch } from '../CatalogHead/CatalogHeader';
import { CatalogHead } from '../CatalogHead/CatalogHead';
import { HistorySlider } from '../../HistorySlider/HistorySlider';
import { HydrationComponent } from '../../ProductPage/ProductPage';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { RecomendationElement } from '../../RecomendationElement/RecomendationElement';
import { useProductHistory } from '../../../context/MobxStoreContext/MobxStoreContext';
import { ChildCategoriesElement } from '../../CatalogContainer/ChildCategoriesElement/ChildCategoriesElement';
import { ManufacturerProductPageElement } from '../../CatalogContainer/ManufacturerProductPageElement/ManufacturerProductPageElement';
import { ManufacturerInfoElement } from '../ManufacturerInfoElement/ManufacturerInfoElement';
import { ManufacturerPageAllProductsHeader } from '../ManufacturerPageAllProductsHeader/ManufacturerPageAllProductsHeader';

export interface FetchURLData {
	params: { [K: string]: string };
	query: URLSearchParams;
}

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

function Catalog({ CatalogData, isManufacturerPage }: { CatalogData: CatalogData; isManufacturerPage?: boolean }): ReactElement {
	const FiltersEnabled = CatalogData.filtersData.status.is404Page === false;
	return (
		<div className="catalog__page__wrapper" itemScope itemType="https://schema.org/OfferCatalog">
			<CatalogHead>
				<BreadcrumbByURL
					category={CatalogData.filtersData.category}
					settings={{ includeHomePage: true }}
					manufacturer={CatalogData.ManufacturerData}
				/>
				{CatalogData.isSearch && CatalogData.pageHeader ? (
					<CatalogHeaderSearch searchString={CatalogData.pageHeader} paginator={CatalogData.productsData.paginator} />
				) : (
					<CatalogHeader content={CatalogData.pageHeader} paginator={CatalogData.productsData.paginator} isCounterEnabled={!isManufacturerPage} />
				)}
				<ManufacturerInfoElement manufacturer={CatalogData.ManufacturerData} />

				<ChildCategoriesElement
					isInner={false}
					category={CatalogData.filtersData.category}
					manufacturer={CatalogData.ManufacturerData}
					pageHeader={CatalogData.pageHeader}
					isManufacturerPage={isManufacturerPage}
				/>
				{!CatalogData.isManufacturerPage ? <ManufacturerProductPageElement category={CatalogData.filtersData.category} /> : null}
				{isManufacturerPage ? <ManufacturerPageAllProductsHeader paginator={CatalogData.productsData.paginator} /> : null}
			</CatalogHead>
			<div className="catalog__body">
				{FiltersEnabled ? <FacetFilter initialFilters={CatalogData?.filtersData} /> : null}
				<CatalogContainer CatalogData={CatalogData} />
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

export default Catalog;
