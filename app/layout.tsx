import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/Cards/ProductCardGeneral.scss';
import '../styles/variables.scss';

import { ReactElement } from 'react';

import WidthLimiter from '../components/Shared/WidthLimiter/WidthLimiter';
import Layout from '../components/layout/layout';
import { BreadcrumbContext } from '../context/Breadcrumb/BreadcrumbContext';
import { CategoriesContext } from '../context/Categories/CategoriesContext';

import { MobxStoreSessionBasedContext, UserSession } from '../context/MobxStoreContext/MobxStoreContext';
import { cookies } from 'next/dist/client/components/headers';
import { NextRequest, NextResponse } from 'next/server';

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

async function getSessionData(): Promise<UserSession> {
	const UserUID = cookies().get('UID_TOKEN');
	let userSessionFetch;
	if (UserUID) {
		userSessionFetch = getData(`${PROXY_URL}session/get`, { headers: { Cookie: cookies().toString() } });
	}
	return userSessionFetch;
}

async function RootLayout({ children }: { children: ReactElement }) {
	const categoriesFetch = getData(`${PROXY_URL}products/categories/`, { next: { revalidate: 3600 } });

	const [categories, userSession] = await Promise.all([categoriesFetch, getSessionData()]);

	return (
		<html lang="en">
			<head>
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
			</head>
			<body>
				<CategoriesContext initialCategories={categories}>
					<BreadcrumbContext>
						<MobxStoreSessionBasedContext session={userSession}>
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
