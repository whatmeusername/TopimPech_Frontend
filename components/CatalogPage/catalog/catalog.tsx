import { useState, useEffect, useRef, ReactNode, useMemo, ReactElement } from 'react';
import './CatalogContainer.scss';

// ==== NEXT ====
import { ParsedUrlQuery } from 'querystring';
import { useRouter, NextRouter } from 'next/router';
import Link from 'next/link';

// ==== ProdcutCards Templates =====
import ProductCardGrid from '../../CatalogComponents/product/ProductСardGrid';
import ProductCardRow from '../../CatalogComponents/product/ProductCardRow';
import { ProductCardGridSkeleton, ProductCardRowSkeleton } from '../../skeletons/skeletons';

// ===== Utils =======
import axios from 'axios';
import { usePagePropsContext } from '../../../pages/_app';
import { declOfNum } from '../../../utils/';

// ===== Interface =====
import type { ProductData } from '../../CatalogComponents/product/interface';
import type { PaginatorData } from './Paginator/interface';

// ==== Breadcrumb ====
import { useBreadcrumbContext, useCategoriesContext } from '../../GlobalContext/';
import BreadcrumbByURL from '../../CatalogComponents/breadcrumb/breacrumb';

// ==== Elements =====
import FacetFilter from './Filter/Filter';
import ChangeProductView, { getInitialView } from './ChangeProductView/ChangeProductView';
import Paginator from './Paginator/Paginator';
import ProductSort from './ProductSort/ProductSort';

export interface ProductAPIResponse {
	products: ProductData[];
	paginator: PaginatorData;
	status: { status: number; message: string; is404Page: boolean };
}

export interface initData {
	productsData: ProductAPIResponse;
	filter: { [K: string]: any };
	view: 'grid' | 'row';
	order: string;
}

function compare(a: any, b: any) {
	return a.id < b.id ? -1 : 0;
}

export function SearchParamsBuilder(
	url: string,
	query: ParsedUrlQuery | undefined,
	...rest: string[]
): [string, string] {
	const isURLSearchParams = query === undefined;
	const searchParams: URLSearchParams | ParsedUrlQuery = isURLSearchParams
		? new URLSearchParams(window.location.search)
		: query;

	function getSearchParams(...params: string[]): string {
		let SearchParams = '?';
		params.forEach((param) => {
			const paramRes = isURLSearchParams
				? (searchParams as URLSearchParams).get(param)
				: (searchParams as ParsedUrlQuery)[param];
			if (paramRes) {
				if (SearchParams.length === 1) {
					SearchParams += `${param}=${paramRes}`;
				} else {
					SearchParams += `&${param}=${paramRes}`;
				}
			}
		});
		return SearchParams;
	}

	const SearchParams = getSearchParams(...rest);

	return [url + SearchParams, SearchParams];
}

const ProductColumn = ({
	products,
	view = 'row',
	fadeIn = false,
}: {
	products: ProductData[];
	view: string;
	fadeIn: boolean;
}): JSX.Element => {
	if (products.length === 0) {
		return (
			<>
				{Array.from(Array(24).keys()).map((item) => {
					if (view === 'grid') return <ProductCardGridSkeleton key={`product__skeleton__${item}`} />;
					else return <ProductCardRowSkeleton key={`product__skeleton__${item}`} />;
				})}
			</>
		);
	} else
		return (
			<>
				{products.map((product) => {
					product.images.sort(compare);
					if (view === 'grid') return <ProductCardGrid product={product} key={product.slug} fadeIn={fadeIn} />;
					else return <ProductCardRow product={product} key={product.slug} fadeIn={fadeIn} />;
				})}
			</>
		);
};

const ChildCategoriesElement = (): ReactElement => {
	const childCategories = useCategoriesContext();
	const router = useRouter();
	const { maincategory, category } = router.query as { maincategory: string; category: string };
	console.log(maincategory, category, childCategories?.find(maincategory, category));
	return <></>;
};

const ProductCatalogHeader = ({
	disabled,
	setCatalogView,
}: {
	disabled: boolean;
	setCatalogView: (...args: any[]) => void;
}) => {
	return (
		<div className="product__catalog__header">
			<ChildCategoriesElement />
			<ProductSort disabled={disabled} />
			<ChangeProductView disabled={disabled} setCatalogView={setCatalogView} />
		</div>
	);
};

function getItemsPerPage(): number {
	let itemsPerPage = 36;
	if (typeof window !== 'undefined') {
		const searchParams = new URLSearchParams(window.location.search);
		const itemsPerPageParsed = searchParams.get('items_per_page');
		itemsPerPage =
			itemsPerPageParsed !== null && typeof itemsPerPageParsed === 'string' ? Number(itemsPerPageParsed) : itemsPerPage;
	}
	return itemsPerPage;
}

const CatalogContainerFooter = ({ children }: { children: ReactNode[] | ReactNode }): ReactElement => {
	return <div className="catalog__footer">{children}</div>;
};

const CatalogContainerViewedItems = ({ PaginatorData }: { PaginatorData: PaginatorData }): ReactElement => {
	return (
		<p className="viewed__products__count">
			Вы просмотрели {getItemsPerPage() * PaginatorData.page} из {PaginatorData.count}{' '}
			{declOfNum(PaginatorData.count, ['товар', 'товаров', 'товаров'])}
		</p>
	);
};

const StandardBreakLine = () => {
	return <hr className="break__line__standard" />;
};

const CatalogContainer = ({ getFetchURL }: { getFetchURL: (router: NextRouter) => [string, string] }): ReactElement => {
	const router = useRouter();
	const initData = usePagePropsContext();

	const { maincategory, category } = router.query as { maincategory: string; category: string };
	const [CatalogData, setCatalogData] = useState<ProductAPIResponse>(initData?.productsData);
	const [catalogView, setCatalogView] = useState<'row' | 'grid'>(getInitialView(router) ?? 'grid');

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
		//eslint-disable-next-line
	}, [maincategory, category, SearchParams]);

	const isFetched = IsLoaded();

	return (
		<div className="catalog__wrapper">
			<ProductCatalogHeader
				disabled={CatalogData?.products === undefined || CatalogData?.products?.length === 0}
				setCatalogView={setCatalogView}
			/>
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

function CatalogHead({ children }: { children: ReactNode[] }): ReactElement {
	return <div className="catalog__head__wrapper">{children}</div>;
}

function CatalogHeader({ paginator }: { paginator: PaginatorData }): ReactElement {
	const breacrumbData = useBreadcrumbContext();
	const { maincategory, category } = useRouter().query as { maincategory: string; category: string };

	const header = useMemo(() => {
		const currentBreadcrumbItem = breacrumbData?.get({ start: maincategory, end: category });
		if (currentBreadcrumbItem) {
			const dataFromBreadcrumb = breacrumbData.getUntil(currentBreadcrumbItem, maincategory ?? '', category ?? '');

			const findHeader = category ? category : maincategory;
			return dataFromBreadcrumb.data.find((data) => data.slug === findHeader)?.name ?? '';
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

function ProductsNotFound(): ReactElement {
	return (
		<div className="catalog__page__not__fount__wrapper">
			<div className="catalog__page__not__found">
				<p className="catalog__page__not__found__text">Упс! К сожалению, по вашему запросу ничего не было найдено</p>
				<Link href={'/'} className="return__to_main_page__button">
					Вернуться на главную
				</Link>
			</div>
		</div>
	);
}

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
						<FacetFilter />
					</div>
					<CatalogContainer getFetchURL={getFetchURL} />
				</div>
			</div>
		);
	} else {
		return <ProductsNotFound />;
	}
}
