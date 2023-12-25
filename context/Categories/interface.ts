import { BaseImage } from '../../components/CatalogComponents/Cards/interface';
import { ManufacturerData } from '../../components/HomePageElement/interface';

interface CategoryData {
	name: string;
	slug: string;
	child: CategoryData[];
	href?: string;
	parentCategory?: CategoryData;
	productCount: number;
	image: BaseImage;
	manufacturers: ManufacturerData[];
}

export type { CategoryData };
