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
import { CATALOG_VIEW_COOKIE, CatalogView } from '../components/CatalogContainer/ChangeProductView/interface';
import { Metadata } from 'next/types';

const PROXY_URL = process.env.PROXY_URL;
const PROXY_URL_SLICED = PROXY_URL ? PROXY_URL.slice(0, PROXY_URL.length - 1) : '';
const BASE_PHONE = '+7 (916) 926-96-66';
const DOMAIN_NAME = 'TopimPech.ru';
const DOMAIN_NAME_LOCALE = 'ТопимПечь.ру';
const FULL_DOMAIN = `https://${DOMAIN_NAME}`;

const PRODUCT_PAGE_SUB_LABEL = `купить в интернет-магазине товаров для бани ${DOMAIN_NAME_LOCALE}`;
const PAGE_SUB_LABEL = `- интернет-магазин товаров для бани ${DOMAIN_NAME_LOCALE}`;
const META_PAGE_DESCRIPTION = (prodcutName: string) =>
	`${prodcutName} - купить по доступной цене в интернет-магазине товаров для бани ${DOMAIN_NAME_LOCALE}. ${prodcutName} - характеристика, фото, описание, Заказ товаров и консултация по телефону - ${BASE_PHONE}`;
const META_PAGE_DESCRIPTION_BASE = `${DOMAIN_NAME_LOCALE} это интернет магазин товаров для вашей бани и дома`;

const PAGE_NOT_FOUND = 'Ошибка 404. Страница не была найдена.';

const OPENGRAPH_BASE = {
	locale: 'ru_RU',
	siteName: DOMAIN_NAME,
	type: 'website',
};

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

function GetCatalogView(): CatalogView {
	const view = (cookies().get(CATALOG_VIEW_COOKIE)?.value as CatalogView) ?? CatalogView.ROW;
	if (!Object.values(CatalogView).includes(view)) {
		return CatalogView.ROW;
	}
	return view;
}

export const metadata: Metadata = {
	title: `${DOMAIN_NAME_LOCALE} это интернет магазин товаров для бани, дома и строительства. Помогаем с подбором товаров`,
	openGraph: { ...OPENGRAPH_BASE, url: FULL_DOMAIN },
};

async function RootLayout({ children }: { children: ReactElement }) {
	const categoriesFetch = getData(`${PROXY_URL}products/categories/`, { next: { revalidate: 3600 } });
	const userAgentString = headers().get('user-agent') ?? '';
	const [categoriesData, userSession] = await Promise.all([categoriesFetch, getSessionData()]);

	return (
		<html lang="en">
			<head>
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body>
				<GlobalContext productCount={categoriesData.totalProducts} view={GetCatalogView()} basePhoneNumber={BASE_PHONE}>
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
export {
	PROXY_URL,
	PRODUCT_PAGE_SUB_LABEL,
	PAGE_NOT_FOUND,
	META_PAGE_DESCRIPTION,
	BASE_PHONE,
	DOMAIN_NAME,
	PROXY_URL_SLICED,
	OPENGRAPH_BASE,
	FULL_DOMAIN,
	PAGE_SUB_LABEL,
	META_PAGE_DESCRIPTION_BASE,
};
export default RootLayout;
