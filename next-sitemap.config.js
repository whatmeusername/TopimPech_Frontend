/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://topimpech.ru',
	generateRobotsTxt: false,
	generateIndexSitemap: true,
	exclude: ['/sitemap_tov.xml', '/sitemap_cat.xml', '/sitemap_manufacturer.xml', '/apple-icon.png', '/robots.txt'],
	robotsTxtOptions: {
		additionalSitemaps: [
			`${process.env.SITE_URL || 'https://topimpech.ru'}/sitemap_cat.xml`,
			`${process.env.SITE_URL || 'https://topimpech.ru'}/sitemap_cat.xml`,
			`${process.env.SITE_URL || 'https://topimpech.ru'}/sitemap_manufacturer.xml`,
		],
	},
	// (optional)
};
