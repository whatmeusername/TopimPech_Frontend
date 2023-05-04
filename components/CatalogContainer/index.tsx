import axios from 'axios';
import { NextRouter, useRouter } from 'next/router';
import { ReactElement, useState, useRef, useEffect } from 'react';
import { usePagePropsContext } from '../../pages/_app';
import { ProductAPIResponse } from '../CatalogPage/catalog/interface';
import Paginator from './Paginator/Paginator';
import { useCatalogView } from '../../hooks/useCatalogView';
import { ProductCatalogHeader } from './ProductCatalogHeader/ProductCatalogHeader';
import { ProductColumn } from './ProductColumn/ProductColumn';

import { CatalogContainerFooter } from './CatalogContainerFooter/CatalogContainerFooter';

import './CatalogContainer.scss';
import { ChildCategoriesElement } from './ChildCategoriesElement/ChildCategoriesElement';
import { StandardBreakLine } from '../Shared/StandardBreakLine/StandardBreakLine';
import { CatalogContainerViewedItems } from './CatalogContainerViewedItems/CatalogContainerViewedItems';

const CatalogContainer = ({ getFetchURL }: { getFetchURL: (router: NextRouter) => [string, string] }): ReactElement => {
	const router = useRouter();
	const initData = usePagePropsContext();

	const { maincategory, category } = router.query as { maincategory: string; category: string };
	const [CatalogData, setCatalogData] = useState<ProductAPIResponse>(initData?.productsData);
	const [catalogView, setCatalogView] = useCatalogView();

	const isLoaded = useRef<number>(0);

	const IsLoaded = () => {
		if (isLoaded.current === 1) {
			isLoaded.current = 0;
			return true;
		}
		return false;
	};

	const [fetchURL, SearchParams] = getFetchURL(router);

	useEffect(() => {
		isLoaded.current = 0;
		if (initData?.productsData?.products === undefined) {
			axios({
				method: 'GET',
				url: fetchURL,
			}).then(({ data }: { data: ProductAPIResponse }) => {
				setCatalogData(data);
				isLoaded.current = 1;
			});
		} else setCatalogData(initData.productsData);
	}, [maincategory, category, SearchParams]);

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
