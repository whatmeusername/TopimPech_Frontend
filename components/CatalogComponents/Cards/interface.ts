interface BaseImage {
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
	keyGroup: string;
	description: string;
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

interface ProductTag {
	name: string;
	slug: string;
	product: ProductData[];
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

interface ProductPriceHistory {
	date: string;
	price: number;
}

interface Manufacturer {
	id: number;
	slug: string;
	name: string;
	image: BaseImage;
	description: string;
}

interface ProductType {
	name: string;
	slug: string;
	category: ProductBaseData;
}

interface ProductData {
	id: number;
	name: string;
	article: string;
	price: number;
	sale: number;
	images: BaseImage[];
	manufacturer: Manufacturer;
	categories: ProductBaseData[];
	type?: ProductType;
	properties: Property[];
	slug: string;
	descriptionFlat?: string;
	descriptionDOM?: string;
	suitableProducts: ProductData[];
	available: boolean;
	quanity?: number;
	priceHistory: ProductPriceHistory[];
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
	ProductTags: ProductTag[];
}

export type {
	MappedProductsResponse,
	ProductData,
	Property,
	FeatureKey,
	BaseImage,
	ProductBaseData,
	ProductDataShort,
	ProductPriceHistory,
	Manufacturer,
	ProductTag,
	ProductType,
};
