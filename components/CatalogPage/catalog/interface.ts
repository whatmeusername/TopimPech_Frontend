import { Manufacturer, ProductData } from '../../CatalogComponents/Cards/interface';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';
import { FilterFetchData } from '../Filter/Filter';

interface ProductAPIResponse {
	products: ProductData[];
	paginator: PaginatorData;
	category: string;
	status: { status: number; message: string; is404Page: boolean };
}

interface CatalogData {
	productsData: ProductAPIResponse;
	filtersData: FilterFetchData;
	order: string;
	pageHeader: string;
	isSearch: boolean;
	isManufacturerPage: boolean;
	ManufacturerData?: Manufacturer;
	params: {
		category?: string;
		manufacturer?: string;
	};
}

export type { ProductAPIResponse, CatalogData };
