import type { MetadataRoute } from 'next';

import { fetchCategories, fetchMainInfo, fetchProductsSitemap } from '../appRouteUtils';
import { CategoryData } from '../context/Categories';

export async function generateSitemaps() {
	// Fetch the total number of products and calculate the number of sitemaps needed
	return [{ id: 'products' }, { id: 'cat_manufacturers' }, { id: 'manufacturers' }, { id: 'categories' }];
}

async function GetProductsSitemap() {
	const products: { slug: string; updated: Date }[] = (await fetchProductsSitemap()) ?? [];
	const prefix = process.env.SITE_URL;
	return products.map((product) => {
		return {
			url: `${prefix}/product/${product.slug}`,
			lastmod: new Date(product.updated).toISOString(),
			changefreq: 'weekly',
			priority: 0.7,
		};
	});
}

async function GetManufacturersSitemap() {
	const prefix = process.env.SITE_URL;
	const sizeMainInfo = await fetchMainInfo();
	return sizeMainInfo.manufacturerData.map((m) => {
		return {
			url: `${prefix}/catalog/manufacturer/${m.slug}`,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: 0.7,
		};
	});
}

async function GetCategoriesSitemap() {
	const categories = (await fetchCategories())?.categories ?? [];
	console.log(categories);
	const prefix = process.env.SITE_URL;
	const result: any[] = [];

	function mapCategory(category: CategoryData): void {
		result.push({
			url: `${prefix}/catalog/${category.slug}`,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: 0.7,
		});
		if (category.child) {
			for (let i = 0; i < category.child.length; i++) mapCategory(category.child[i]);
		}
	}
	for (let i = 0; i < categories.length; i++) {
		mapCategory(categories[i]);
	}
	return result;
}

async function GetCategoryManufacturersSitemap() {
	const prefix = process.env.SITE_URL;
	const categories = (await fetchCategories()).categories;
	const resultSitemapFields = [];
	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];
		for (let j = 0; j < category.manufacturers.length; j++) {
			resultSitemapFields.push({
				url: `${prefix}/catalog/${category.slug}/${category.manufacturers[j].slug}`,
				lastmod: new Date().toISOString(),
				changefreq: 'weekly',
				priority: 0.7,
			});
		}
	}
	return resultSitemapFields;
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
	if (id === 'products') {
		return await GetProductsSitemap();
	} else if (id === 'cat_manufactures') {
		return await GetCategoryManufacturersSitemap();
	} else if (id === 'manufacturers') {
		return await GetManufacturersSitemap();
	} else if (id === 'categories') {
		return await GetCategoriesSitemap();
	}
	return [];
}
