import { ProductData } from '../../CatalogComponents/Cards/interface';
import { CatalogView } from '../../CatalogContainer/ChangeProductView/interface';
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
	view: CatalogView;
	order: string;
}

export type { ProductAPIResponse, initData };
