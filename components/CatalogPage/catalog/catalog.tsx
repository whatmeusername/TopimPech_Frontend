import { useState, useEffect, useRef } from 'react';

// ==== NEXT ====
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from 'next/router';
import Link from 'next/link';

// ==== ProdcutCards Templates =====
import ProductCardGrid from '../../CatalogComponents/product/ProductСardGrid';
import ProductCardRow from '../../CatalogComponents/product/ProductCardRow';
import { ProductCardGridSkeleton, ProductCardRowSkeleton } from '../../skeletons/skeletons';

// ===== Utils =======
import axios from 'axios';
import { usePagePropsContext } from '../../../pages/catalog/[maincategory]';
import declOfNum from '../../../utils/decOfNum';

// ===== Interface =====
import type { ProductData } from '../../CatalogComponents/product/interface';
import type { PaginatorData } from './Paginator/interface';

// ==== Breadcrumb ====
import useBreadcrumbContext from '../../GlobalContext/Breadcrumb/Context';
import BreadcrumbByURL from '../../CatalogComponents/breadcrumb/breacrumb';

// ==== Elements =====
import FacetFilter from './Filter/Filter';
import ChangeProductView from './ChangeProductView/ChangeProductView';
import Paginator from './Paginator/Paginator';
import ProductSort from './ProductSort/ProductSort';
import Slider from '../../Slider/Slider';

export interface ProductAPIResponse {
	products: ProductData[];
	paginator: PaginatorData;
	status: { status: number; message: string; is404Page: boolean };
}

export interface initData {
	productsData: ProductAPIResponse;
	filter: {};
	view: 'grid' | 'row';
	order: string;
}

function compare(a: any, b: any) {
	if (a.id < b.id) {
		return -1;
	}
	return 0;
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
			let paramRes = isURLSearchParams
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

	let SearchParams = getSearchParams(...rest);

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
		let SkeletonsCountArr = Array.from(Array(24).keys());
		return (
			<>
				{SkeletonsCountArr.map((item) => {
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

					return view === 'grid' ? (
						<ProductCardGrid product={product} key={product.slug} fadeIn={fadeIn} />
					) : (
						<ProductCardRow product={product} key={product.slug} fadeIn={fadeIn} />
					);
				})}
			</>
		);
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
			<ProductSort disabled={disabled} />
			<ChangeProductView disabled={disabled} setCatalogView={setCatalogView} />
		</div>
	);
};

function getItemsPerPage(): number {
	let itemsPerPage = 36;
	if (typeof window !== 'undefined') {
		const searchParams = new URLSearchParams(window.location.search);
		let itemsPerPageParsed = searchParams.get('items_per_page');
		itemsPerPage =
			itemsPerPageParsed !== null && typeof itemsPerPageParsed === 'string'
				? Number(itemsPerPageParsed)
				: itemsPerPage;
	}
	return itemsPerPage;
}

const CatalogContainer = ({ ProductCount }: { ProductCount: any }): JSX.Element => {
	const router = useRouter();
	const initData = usePagePropsContext();
	const { maincategory, category } = router.query as { maincategory: string; category: string };
	const [CatalogData, setCatalogData] = useState<ProductAPIResponse>(initData?.productsData ?? null!);
	const [catalogView, setCatalogView] = useState<'row' | 'grid'>(initData?.view ?? 'grid');

	const isLoaded = useRef<number>(0);

	const IsLoaded = () => {
		if (isLoaded.current === 1) {
			isLoaded.current = 0;
			return true;
		}
		return false;
	};

	let url = '/api/products/filter/';
	if (maincategory) url += `${maincategory}/`;
	if (category) url += `${category}/`;
	let [fetchUrl, SearchParams] = SearchParamsBuilder(url, router.query, 'page', 'items_per_page', 'order', 'filter');

	useEffect(() => {
		isLoaded.current = 0;
		if (initData?.productsData?.products === undefined) {
			axios({
				method: 'GET',
				url: fetchUrl,
			}).then(({ data }: { data: ProductAPIResponse }) => {
				setCatalogData(data);
				ProductCount.current?.setCount(data.paginator?.count ?? 0);
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
			<hr className="break__line__standard"></hr>
			<div
				className={`catalog__products__container ${
					catalogView === 'grid' ? 'display__row' : 'display__column'
				}`}
			>
				<ProductColumn products={CatalogData?.products ?? []} view={catalogView} fadeIn={isFetched} />
			</div>
			{CatalogData?.paginator && CatalogData?.paginator.pages > 1 ? (
				<>
					<hr className="break__line__standard"></hr>
					<div className="catalog__footer">
						<Paginator PaginatorData={CatalogData.paginator} />
						<p className="viewed__products__count">
							Вы просмотрели {getItemsPerPage() * CatalogData.paginator.page} из{' '}
							{CatalogData.paginator.count}{' '}
							{declOfNum(CatalogData.paginator.count, ['товар', 'товаров', 'товаров'])}
						</p>
					</div>
				</>
			) : (
				''
			)}
		</div>
	);
};

export default function Catalog({ initData }: { initData: initData }): JSX.Element {
	const ProductCount = useRef<any>(null!);

	const CatalogHeader = () => {
		const [count, setCount] = useState<number>(initData.productsData?.paginator.count ?? 0);

		useEffect(() => {
			ProductCount.current = { count: count, setCount: setCount };
		}, []);

		const breacrumbData = useBreadcrumbContext();
		const router = useRouter();
		let { maincategory, category } = router.query as { maincategory: string; category: string };

		let header = '';

		if (breacrumbData) {
			let currentBreadcrumbItem = breacrumbData.get({ start: maincategory, end: category });
			if (currentBreadcrumbItem) {
				const dataFromBreadcrumb = breacrumbData.getUntil(
					currentBreadcrumbItem,
					maincategory ?? '',
					category ?? '',
				);

				let findHeader = category ? category : maincategory;
				header = dataFromBreadcrumb.data.find((data) => data.slug === findHeader)?.name ?? '';
			}
		}

		return (
			<div className="catalog__head__wrapper">
				<BreadcrumbByURL settings={{ includeHomePage: true }} />
				<div className="catalog__header__wrapper">
					<h1 className="catalog__header">{header}</h1>
					<span className="catalog__header__count">
						{count} {declOfNum(count, ['товар', 'товара', 'товаров'])}
					</span>
				</div>
			</div>
		);
	};

	let responseStatus = initData?.productsData?.status?.is404Page ?? true;

	if (!responseStatus) {
		return (
			<div className="catalog__page__wrapper">
				<CatalogHeader />
				<div className="catalog__body">
					<div className="catalog__filters__wrapper">
						<FacetFilter />
					</div>
					<CatalogContainer ProductCount={ProductCount} />
				</div>
			</div>
		);
	} else {
		return (
			<div className="catalog__page__not__fount__wrapper">
				<div className="catalog__page__not__found">
					<p className="catalog__page__not__found__text">
						Упс! К сожалению, по вашему запросу ничего не было найдено
					</p>
					<Link href={'/'}>
						<a className="return__to_main_page__button">Вернуться на главную</a>
					</Link>
				</div>
			</div>
		);
	}
}
