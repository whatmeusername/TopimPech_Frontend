import { Manufacturer, ProductBaseData, ProductTag, ProductType } from '../CatalogComponents/Cards/interface';

interface OurWorksData {
	path: string;
	name: string;
	extension: string;
}

interface ManufacturerRootCategoryData extends ProductBaseData {
	image: null | {
		path: string;
		name: string;
	};
}

interface ManufacturerCategoryData extends ProductBaseData {
	id: number;
	parentID: number;
	image: null | {
		path: string;
		name: string;
	};
}

interface ManufacturerData extends Manufacturer {
	productCount: number;
	categories: ManufacturerCategoryData[];
	rootCategories: ManufacturerRootCategoryData[];
}

interface SiteInfoData {
	OurWorks: OurWorksData[];
	manufacturerData: ManufacturerData[];
	ProductsTags: ProductTag[];
	ProductTypes: ProductType[];
}

export type { OurWorksData, ManufacturerData, SiteInfoData, ManufacturerCategoryData, ManufacturerRootCategoryData };
