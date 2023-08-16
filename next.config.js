/** @type {import('next').NextConfig} */

const path = require('path');

const PROXY_URL = process.env.PROXY_URL;

const securityHeaders = [
	{ key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'X-DNS-Prefetch-Control', value: 'on' },
	{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
];

const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	experimental: {
		appDir: true,
	},

	webpack(config) {
		config.module.rules.forEach((rule) => {
			const { oneOf } = rule;
			if (oneOf) {
				oneOf.forEach((one) => {
					if (!`${one.issuer?.and}`.includes('_app')) return;
					one.issuer.and = [path.resolve(__dirname)];
				});
			}
		});
		config.module.rules.push({
			test: /\.svg$/i,
			use: ['@svgr/webpack'],
		});
		return config;
	},

	async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: PROXY_URL + ':path*', // Proxy to Backend
			},
		];
	},

	async headers() {
		return [{ source: '/(.*)', headers: securityHeaders }];
	},
};

(module.exports = nextConfig), PROXY_URL;
