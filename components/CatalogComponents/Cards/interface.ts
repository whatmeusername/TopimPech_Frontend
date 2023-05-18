export interface ProductImage {
	id: number;
	name: string;
	path: string;
	extension: string;
	dir: string;
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
	article: string;
	price: number;
	sale: number;
	images: ProductImage[];
	manufacturer: ProductBaseData;
	categories?: ProductBaseData[];
	type?: ProductBaseData;
	properties?: Property[];
	slug: string;
	description?: string;
}
