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

interface MappedProductsResponse<IS_SHORT extends boolean = false> {
	count: number;
	data: IS_SHORT extends true ? ProductDataShort[] : ProductData[];
	total: number;
}

interface productTags {
	name: string;
}

interface ProductDataShort {
	id: number;
	slug: string;
	name: string;
	categories: ProductData['categories'];
	images: ProductData['images'];
	price: number;
	sale: number;
	article: string;
	available: boolean;
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
	properties: Property[];
	slug: string;
	descriptionFlat?: string;
	descriptionDOM?: string;
	suitableProducts: ProductData[];
	available: boolean;
	quanity?: number;
	RelatedProductsTable: {
		key: string;
		relatedProducts: {
			value: string;
			product: {
				slug: string;
				article: string;
				available: boolean;
			};
		}[];
	};
	ProductTags: productTags[];
}

export type { MappedProductsResponse, ProductData, Property, FeatureKey, ProductImage, ProductBaseData, ProductDataShort };
