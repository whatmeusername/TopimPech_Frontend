import { Metadata } from 'next';
import { ServerSideURLProps } from '../app/layout';
import { ProductData, ProductBaseData, BaseImage, ProductCategoryData } from '../components/CatalogComponents/Cards/interface';
import { FilterFetchData } from '../components/CatalogPage/Filter/interface';
import { ProductAPIResponse } from '../components/CatalogPage/catalog/interface';
import { GetCategoryName } from './GetCategoryName';
import { PRODUCT_PAGE_SUB_LABEL, META_PAGE_DESCRIPTION, SITE_URL_SLICED, FULL_DOMAIN, OPENGRAPH_BASE } from '../const/siteinfo.const';

function GetPageURL(product: ProductData, params: ServerSideURLProps['params'], category: ProductBaseData): string {
	const isManufacturerPage = params?.category === undefined && params.manufacturer !== undefined;
	const isManufacturerCategoryPage = params?.category && params?.manufacturer !== undefined;
	const manufacturer = product.manufacturer;

	if (isManufacturerCategoryPage) {
		return `/catalog/${category.slug}/${manufacturer.slug}`;
	} else if (isManufacturerPage) {
		return `/catalog/manufacturer/${manufacturer.slug}`;
	}
	return `/catalog/${category.slug}/`;
}

function GetPageImage(product: ProductData, params: ServerSideURLProps['params'], category: ProductCategoryData): BaseImage {
	const isManufacturerPage = params?.manufacturer !== undefined;

	if (isManufacturerPage && product?.manufacturer?.image) {
		return product.manufacturer.image;
	} else if (category?.image) {
		return category.image;
	}
	return product.images[0];
}

function GetPageDescriptionText(product: ProductData, params: ServerSideURLProps['params'], category: ProductBaseData, pageHeader: string): string {
	const isManufacturerCategoryPage = params?.category && params?.manufacturer !== undefined;

	const manufacturer = product.manufacturer;

	return isManufacturerCategoryPage ? `${category.name} производителя ${manufacturer.name}` : pageHeader;
}

function CatalogPageMetadata(params: ServerSideURLProps['params'], productsData: ProductAPIResponse, filtersData: FilterFetchData): Metadata {
	const isManufacturerPage = params?.category === undefined && params.manufacturer !== undefined;
	const isManufacturerCategoryPage = params?.category !== undefined && params?.manufacturer !== undefined;

	const product = productsData.products[0];
	const category = product.categories.find((i) => i.slug === filtersData.category) as ProductBaseData;
	const manufacturer = product.manufacturer;

	const pageHeader = GetCategoryName({
		main: isManufacturerPage ? 'Товары производителя' : category.name,
		manufacturer: isManufacturerPage || isManufacturerCategoryPage ? manufacturer.name : undefined,
		categoryStringAdditions: filtersData.categoryStringAdditions,
		capitalize: true,
		replaceManufacturerInCategory: isManufacturerCategoryPage,
	});

	const pageTitle = `${pageHeader} ${PRODUCT_PAGE_SUB_LABEL}`;

	const description = META_PAGE_DESCRIPTION(GetPageDescriptionText(product, params, category, pageHeader));
	const pageURL = GetPageURL(product, params, category);
	const pageImage = GetPageImage(product, params, category);

	return {
		title: pageTitle,
		description: description,
		keywords: `${pageHeader}, купить ${pageTitle} в интернет магазине, цена ${pageTitle}`,
		alternates: { canonical: pageURL },
		openGraph: {
			title: pageTitle,
			description: description,
			images: [`${SITE_URL_SLICED}/api${pageImage.path}`],
			url: `${FULL_DOMAIN}${pageURL}`,
			...OPENGRAPH_BASE,
		},
	};
}

export { CatalogPageMetadata };
