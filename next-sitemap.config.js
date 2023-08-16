/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://topimpech.ru',
	generateRobotsTxt: false,
	exclude: ['/sitemap_tov.xml', '/sitemap_cat.xml'],
	robotsTxtOptions: {
		additionalSitemaps: [
			`${process.env.SITE_URL || 'https://topimpech.ru'}/sitemap_cat.xml`,
			`${process.env.SITE_URL || 'https://topimpech.ru'}/sitemap_tov.xml`,
		],
	},
	// (optional)
};
