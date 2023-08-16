export const dynamic = 'force-dynamic';

import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { fetchCategories } from '../../appRouteUtils';
import { CategoryData } from '../../context/Breadcrumb';

const GetCategoriesURLS = (cateogries: CategoryData[]): ISitemapField[] => {
	const prefix = process.env.SITE_URL;
	const result: ISitemapField[] = [];
	function mapCategory(category: CategoryData): void {
		result.push({
			loc: `${prefix}/catalog/${category.slug}`,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: 0.7,
		});
		if (category.child) {
			for (let i = 0; i < category.child.length; i++) mapCategory(category.child[i]);
		}
	}
	for (let i = 0; i < cateogries.length; i++) {
		mapCategory(cateogries[i]);
	}
	return result;
};

export async function GET() {
	const categories = (await fetchCategories()) ?? null;
	const urls = categories ? GetCategoriesURLS(categories.categories) : [];
	return getServerSideSitemap(urls);
}
