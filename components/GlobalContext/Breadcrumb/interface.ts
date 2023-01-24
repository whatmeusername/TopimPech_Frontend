import type { CategoryData } from '../Categories/interface';
export type { CategoryData };

export type CategoryDataOmit = Omit<CategoryData, 'child'>;

export interface BreadcrumbData {
	start: string;
	end: string;
	contains: string[];
	data: CategoryDataOmit[];
}
