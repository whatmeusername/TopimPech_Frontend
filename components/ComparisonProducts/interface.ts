import type { ProductData } from '../CatalogComponents/Cards/interface';

interface ComparisonProductsConfig {
	data: ProductData[];
	diffWith?: ProductData;
	enableCategoryFilter: boolean;
	URLstart?: string;
	diffLabels?: boolean;
	mobileVersion?: boolean;
	cards: {
		show: boolean;
		isSticky?: boolean;
		showPrice?: boolean;
		canDelete: boolean;
	};
}

enum ComparisonState {
	RAISING = 'raising',
	DECREASE = 'decrease',
	SAME = 'same',
	CHANGED = 'changed',
}

interface ProductComparisonDataValue {
	value: string | number;
	state: ComparisonState | null;
	distance?: any;
	isNull: boolean;
}

type ProductComparisonData = {
	[K: string]: {
		unit: string;
		values: ProductComparisonDataValue[];
	};
};

export { ComparisonState };
export type { ComparisonProductsConfig, ProductComparisonData, ProductComparisonDataValue };
