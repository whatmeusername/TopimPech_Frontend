import { ProductData } from '../../CatalogComponents/Cards/interface';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';
import { FilterFetchData } from '../Filter/Filter';

interface ProductAPIResponse {
	products: ProductData[];
	paginator: PaginatorData;
	status: { status: number; message: string; is404Page: boolean };
}

interface initData {
	productsData: ProductAPIResponse;
	filtersData: FilterFetchData;
	order: string;
	searchHeader?: string;
	isSearch: boolean;
}

export type { ProductAPIResponse, initData };
