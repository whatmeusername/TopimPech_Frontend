'use client';

import { ReactElement, useRef } from 'react';

import { ProductAPIResponse } from '../CatalogPage/catalog/interface';
import Paginator from './Paginator/Paginator';
import { useCatalogView } from '../../hooks/useCatalogView';
import { ProductCatalogHeader } from './ProductCatalogHeader/ProductCatalogHeader';
import { ProductColumn } from './ProductColumn/ProductColumn';

import { CatalogContainerFooter } from './CatalogContainerFooter/CatalogContainerFooter';

import './CatalogContainer.scss';
import { ChildCategoriesElement } from './ChildCategoriesElement/ChildCategoriesElement';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import { CatalogContainerViewedItems } from './CatalogContainerViewedItems/CatalogContainerViewedItems';

import { FetchURLData } from '../CatalogPage/catalog';
import { AllFiltersOpenButton } from '../CatalogPage/Filter/Filter';

const CatalogContainer = ({
	CatalogData,
	getFetchURL,
}: {
	CatalogData: ProductAPIResponse;
	getFetchURL: (router: FetchURLData) => [string, string];
}): ReactElement => {
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
			<ChildCategoriesElement />
			<AllFiltersOpenButton shortLabel={true} />
			<ProductCatalogHeader disabled={CatalogData?.products === undefined || CatalogData?.products?.length === 0} setCatalogView={setCatalogView} />
			<StandardBreakLine />
			<div className={`catalog__products__container ${catalogView === 'grid' ? 'display__row' : 'display__column'}`}>
				<ProductColumn products={CatalogData?.products ?? []} view={catalogView} fadeIn={isFetched} />
			</div>
			{CatalogData?.paginator && CatalogData.paginator.pages > 1 ? (
				<>
					<StandardBreakLine />
					<CatalogContainerFooter>
						<Paginator PaginatorData={CatalogData.paginator} />
						<CatalogContainerViewedItems PaginatorData={CatalogData.paginator} />
					</CatalogContainerFooter>
				</>
			) : null}
		</div>
	);
};

export { CatalogContainer };
