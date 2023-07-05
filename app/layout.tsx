import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/Cards/ProductCardGeneral.scss';
import '../styles/variables.scss';
import { headers } from 'next/headers';

import { ReactElement } from 'react';

import WidthLimiter from '../components/Shared/WidthLimiter/WidthLimiter';
import Layout from '../components/layout/layout';
import { BreadcrumbContext } from '../context/Breadcrumb/BreadcrumbContext';
import { CategoriesContext } from '../context/Categories/CategoriesContext';

import { MobxStoreSessionBasedContext, UserSession } from '../context/MobxStoreContext/MobxStoreContext';
import { cookies } from 'next/dist/client/components/headers';
import { GlobalContext } from '../context/GlobalContext/GlobalContext';
import { MenuModal } from '../components/layout/Menu/Menu';
import { MobileContext } from '../context/MobileContext/MobileContext';

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
	const userAgentString = headers().get('user-agent') ?? '';
	const [categoriesData, userSession] = await Promise.all([categoriesFetch, getSessionData()]);

	return (
		<html lang="en">
			<head>
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
			</head>
			<body>
				<GlobalContext productCount={categoriesData.totalProducts}>
					<MobileContext userAgentString={userAgentString}>
						<CategoriesContext initialCategories={categoriesData.categories}>
							<BreadcrumbContext>
								<MobxStoreSessionBasedContext session={userSession}>
									<Layout>
										<WidthLimiter>{children}</WidthLimiter>
									</Layout>
									<MenuModal />
								</MobxStoreSessionBasedContext>
							</BreadcrumbContext>
						</CategoriesContext>
					</MobileContext>
				</GlobalContext>
			</body>
		</html>
	);
}

export type { ServerSideURLProps };
export { PROXY_URL, PRODUCT_PAGE_SUB_LABEL, PAGE_NOT_FOUND };
export default RootLayout;
