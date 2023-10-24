'use client';

import { ReactElement, useRef } from 'react';

import { ProductAPIResponse } from '../CatalogPage/catalog/interface';
import Paginator from './Paginator/Paginator';
import { useCatalogView } from '../../hooks/useCatalogView';
import { ProductCatalogHeader } from './ProductCatalogHeader/ProductCatalogHeader';
import { ProductColumn } from './ProductColumn/ProductColumn';

import './CatalogContainer.scss';
import { ChildCategoriesElement } from './ChildCategoriesElement/ChildCategoriesElement';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import { CatalogContainerViewedItems } from './CatalogContainerViewedItems/CatalogContainerViewedItems';

import { AllFiltersOpenButton, FilterFetchData } from '../CatalogPage/Filter/Filter';
import { CatalogContainerFooter } from './CatalogContainerFooter/CatalogContainerFooter';
import { ContactUs } from '../Shared/ContactUs/ContactUs';
import { AppliedFiltersElement } from '../CatalogPage/Filter/AppliedFiltersElement/AppliedFiltersElement';

const CatalogContainer = ({ CatalogData, filtersData }: { CatalogData: ProductAPIResponse; filtersData: FilterFetchData }): ReactElement => {
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
			<ChildCategoriesElement isInner={true} category={filtersData.category} />
			<AllFiltersOpenButton shortLabel={true} />
			<AppliedFiltersElement filtersData={filtersData} />
			<ProductCatalogHeader disabled={CatalogData?.products === undefined || CatalogData?.products?.length === 0} setCatalogView={setCatalogView} />
			<StandardBreakLine />
			<ProductColumn products={CatalogData?.products ?? []} view={catalogView} fadeIn={isFetched} />
			{CatalogData?.paginator && CatalogData.paginator.pages > 1 ? (
				<>
					<StandardBreakLine />
					<CatalogContainerFooter>
						<Paginator PaginatorData={CatalogData.paginator} />
						<CatalogContainerViewedItems PaginatorData={CatalogData.paginator} />
					</CatalogContainerFooter>
					<ContactUs />
				</>
			) : null}
		</div>
	);
};

export { CatalogContainer };
