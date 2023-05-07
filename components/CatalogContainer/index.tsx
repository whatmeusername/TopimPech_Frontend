'use client';

import axios from 'axios';

import { ReactElement, useState, useRef, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

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
import { usePagePropsContext } from '../../context/PagePropsContext';

const CatalogContainer = ({
	CatalogData,
	getFetchURL,
}: {
	CatalogData: ProductAPIResponse;
	getFetchURL: (router: FetchURLData) => [string, string];
}): ReactElement => {
	const params = useParams();
	const query = useSearchParams();

	const { maincategory, category } = params;

	// const [CatalogData, setCatalogData] = useState<ProductAPIResponse>(initData?.productsData);
	const [catalogView, setCatalogView] = useCatalogView();

	const isLoaded = useRef<number>(0);
	const IsLoaded = () => {
		if (isLoaded.current === 1) {
			isLoaded.current = 0;
			return true;
		}
		return false;
	};

	//const [fetchURL, SearchParams] = getFetchURL({ params: params, query: query });

	// useEffect(() => {
	// 	console.log(initData);
	// 	isLoaded.current = 0;
	// 	if (initData?.productsData?.products === undefined) {
	// 		axios({
	// 			method: 'GET',
	// 			url: fetchURL,
	// 		}).then(({ data }: { data: ProductAPIResponse }) => {
	// 			setCatalogData(data);
	// 			isLoaded.current = 1;
	// 		});
	// 	} else setCatalogData(initData.productsData);
	// }, [maincategory, category, SearchParams]);

	const isFetched = IsLoaded();

	return (
		<div className="catalog__wrapper">
			<ChildCategoriesElement />
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
