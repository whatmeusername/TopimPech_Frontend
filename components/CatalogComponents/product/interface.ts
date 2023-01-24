export interface ProductImage {
	id: number;
	name: string;
	path: string;
}

export interface ProductBaseData {
	id: number;
	name: string;
	slug: string;
}

export interface FeatureKey {
	slug: string;
	name: string;
	valueUnit: string;
	valueType: 0 | 1;
}

export interface Property {
	value: string;
	slug: string;
	valueType: 0 | 1;
	key: FeatureKey;
}

export interface ProductData {
	name: string;
	article: number;
	price: number;
	sale: number;
	images: ProductImage[];
	manufacturer: ProductBaseData;
	MainCategory: ProductBaseData;
	categories?: ProductBaseData[];
	type?: ProductBaseData;
	properties?: Property[];
	slug: string;
	description?: string;
}
