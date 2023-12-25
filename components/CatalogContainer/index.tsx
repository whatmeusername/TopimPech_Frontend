'use client';

import { ReactElement, useRef } from 'react';

import Paginator from './Paginator/Paginator';
import { useCatalogView } from '../../hooks/useCatalogView';
import { ProductCatalogHeader } from './ProductCatalogHeader/ProductCatalogHeader';
import { ProductColumn } from './ProductColumn/ProductColumn';

import './CatalogContainer.scss';
import { ChildCategoriesElement } from './ChildCategoriesElement/ChildCategoriesElement';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import { CatalogContainerViewedItems } from './CatalogContainerViewedItems/CatalogContainerViewedItems';

import { AllFiltersOpenButton } from '../CatalogPage/Filter/Filter';
import { CatalogContainerFooter } from './CatalogContainerFooter/CatalogContainerFooter';
import { ContactUs } from '../Shared/ContactUs/ContactUs';
import { AppliedFiltersElement } from '../CatalogPage/Filter/AppliedFiltersElement/AppliedFiltersElement';
import { Manufacturer } from '../CatalogComponents/Cards/interface';
import { CatalogData } from '../CatalogPage/catalog/interface';

const CatalogContainer = ({ CatalogData }: { CatalogData: CatalogData }): ReactElement => {
	const [catalogView, setCatalogView] = useCatalogView();

	const isLoaded = useRef<number>(0);
	const IsLoaded = () => {
		if (isLoaded.current === 1) {
			isLoaded.current = 0;
			return true;
		}
		return false;
	};
	const isFetched = IsLoaded();

	return (
		<div className="catalog__wrapper">
			<ChildCategoriesElement
				isInner={true}
				category={CatalogData.filtersData.category}
				manufacturer={CatalogData.ManufacturerData as Manufacturer}
				pageHeader={CatalogData.pageHeader}
			/>
			<AllFiltersOpenButton shortLabel={true} />
			<AppliedFiltersElement filtersData={CatalogData?.filtersData} />
			<ProductCatalogHeader
				disabled={CatalogData.productsData?.products === undefined || CatalogData.productsData?.products?.length === 0}
				setCatalogView={setCatalogView}
			/>
			<StandardBreakLine />
			<ProductColumn products={CatalogData.productsData?.products ?? []} view={catalogView} fadeIn={isFetched} />
			{CatalogData.productsData?.paginator && CatalogData.productsData.paginator.pages > 1 ? (
				<>
					<StandardBreakLine />
					<CatalogContainerFooter>
						<Paginator PaginatorData={CatalogData.productsData.paginator} />
						<CatalogContainerViewedItems PaginatorData={CatalogData.productsData.paginator} />
					</CatalogContainerFooter>
					<ContactUs />
				</>
			) : null}
		</div>
	);
};

export { CatalogContainer };
