import { ProductImage } from '../../components/CatalogComponents/Cards/interface';

interface CategoryData {
	name: string;
	slug: string;
	child: CategoryData[];
	href?: string;
	parentCategory?: CategoryData;
	productCount?: number;
	image: ProductImage;
}

export type { CategoryData };
