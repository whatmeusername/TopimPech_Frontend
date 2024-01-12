import { Manufacturer, ProductBaseData, ProductTag, ProductType } from '../CatalogComponents/Cards/interface';

interface OurWorksData {
	path: string;
	name: string;
	extension: string;
}

interface ManufacturerData extends Manufacturer {
	productCount: number;
	categories: ProductBaseData[];
}

interface SiteInfoData {
	OurWorks: OurWorksData[];
	manufacturerData: ManufacturerData[];
	ProductsTags: ProductTag[];
	ProductTypes: ProductType[];
}

export type { OurWorksData, ManufacturerData, SiteInfoData };
