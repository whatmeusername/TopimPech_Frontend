interface ProductImage {
	id: number;
	name: string;
	path: string;
	extension: string;
	dir: string;
}

interface ProductBaseData {
	id: number;
	name: string;
	slug: string;
}

interface FeatureKey {
	slug: string;
	name: string;
	valueUnit: string;
	valueType: 0 | 1;
}

interface Property {
	value: string;
	slug: string;
	valueType: 0 | 1;
	key: FeatureKey;
}

interface MappedProductsResponse {
	count: number;
	data: ProductData[];
	total: number;
}

interface ProductData {
	id: number;
	name: string;
	article: string;
	price: number;
	sale: number;
	images: ProductImage[];
	manufacturer: ProductBaseData;
	categories: ProductBaseData[];
	type?: ProductBaseData;
	properties?: Property[];
	slug: string;
	description?: string;
}

export type { MappedProductsResponse, ProductData, Property, FeatureKey, ProductImage, ProductBaseData };
