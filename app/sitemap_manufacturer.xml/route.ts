export const dynamic = 'force-dynamic';

import { ISitemapField, getServerSideSitemap } from 'next-sitemap';
import { fetchMainInfo } from '../../appRouteUtils';

export async function GET() {
	const prefix = process.env.SITE_URL;
	const sizeMainInfo = await fetchMainInfo();
	const urls: ISitemapField[] = sizeMainInfo.manufacturerData.map((m) => {
		return {
			loc: `${prefix}/catalog/manufacturer/${m.slug}`,
			lastmod: new Date().toISOString(),
			changefreq: 'weekly',
			priority: 0.7,
		};
	});

	return getServerSideSitemap(urls);
}
