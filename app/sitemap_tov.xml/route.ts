export const dynamic = 'force-dynamic';

import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { fetchProductsSitemap } from '../../appRouteUtils';

export async function GET() {
	const products: { slug: string; updated: Date }[] = (await fetchProductsSitemap()) ?? [];
	const prefix = process.env.SITE_URL;
	const urls: ISitemapField[] = products.map((product) => {
		return {
			loc: `${prefix}/product/${product.slug}`,
			lastmod: new Date(product.updated).toISOString(),
			changefreq: 'weekly',
			priority: 0.7,
		};
	});

	return getServerSideSitemap(urls);
}
