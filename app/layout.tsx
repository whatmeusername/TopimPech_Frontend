import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/Cards/ProductCardGeneral.scss';
import '../styles/variables.scss';

import { ReactElement } from 'react';

import WidthLimiter from '../components/Shared/WidthLimiter/WidthLimiter';
import Layout from '../components/layout/layout';
import { BreadcrumbContext } from '../context/Breadcrumb/BreadcrumbContext';
import { CategoriesContext } from '../context/Categories/CategoriesContext';
import axios from 'axios';
import { userProductCart } from '../store';
import { MobxStoreSessionBasedContext } from '../context/MobxStoreContext/MobxStoreContext';

const PROXY_URL = process.env.PROXY_URL;
const PRODUCT_PAGE_SUB_LABEL = 'купить в интернет-магазине товаров для бани TopimPech.ru';
const PAGE_NOT_FOUND = 'Ошибка 404. Страница не была найдена.';

export async function getData(url: string, init?: RequestInit) {
	const res = await fetch(url, init);
	if (!res.ok) {
		throw new Error('Failed to fetch data');
	}

	return res.json();
}

interface ServerSideURLProps {
	params: { [K: string]: string };
	searchParams: { [K: string]: string };
}

async function RootLayout({ children }: { children: ReactElement }) {
	const categoriesFetch = getData(`${PROXY_URL}products/categories/`, { cache: 'force-cache', next: { revalidate: 3600 } });
	const userSessionFetch = getData(`${PROXY_URL}session/get`, { cache: 'no-cache' });

	const [categories, userSession] = await Promise.all([categoriesFetch, userSessionFetch]);

	return (
		<html lang="en">
			<head>
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
			</head>
			<body>
				<CategoriesContext initialCategories={categories}>
					<BreadcrumbContext>
						<MobxStoreSessionBasedContext>
							<Layout>
								<WidthLimiter>{children}</WidthLimiter>
							</Layout>
						</MobxStoreSessionBasedContext>
					</BreadcrumbContext>
				</CategoriesContext>
			</body>
		</html>
	);
}

export type { ServerSideURLProps };
export { PROXY_URL, PRODUCT_PAGE_SUB_LABEL, PAGE_NOT_FOUND };
export default RootLayout;
