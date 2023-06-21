export interface CategoryData {
	name: string;
	slug: string;
	child: CategoryData[];
	href?: string;
	parentCategory?: CategoryData;
	productCount: number;
}
