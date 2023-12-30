export const dynamic = 'force-dynamic';

import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { fetchCategories } from '../../appRouteUtils';

export async function GET() {
	const prefix = process.env.SITE_URL;
	const categories = (await fetchCategories()).categories;
	const resultSitemapFields: ISitemapField[] = [];
	for (let i = 0; i < categories.length; i++) {
		const category = categories[i];
		for (let j = 0; j < category.manufacturers.length; j++) {
			resultSitemapFields.push({
				loc: `${prefix}/catalog/${category.slug}/${category.manufacturers[j].slug}`,
				lastmod: new Date().toISOString(),
				changefreq: 'weekly',
				priority: 0.7,
			});
		}
	}

	return getServerSideSitemap(resultSitemapFields);
}
