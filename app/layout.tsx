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
import { fetchCategories, getData } from '../appRouteUtils';

const PROXY_URL = process.env.PROXY_URL ?? 'http://localhost:8000';

const SITE_URL = process.env.SITE_URL ?? PROXY_URL;
const SITE_URL_SLICED = SITE_URL.slice(0, SITE_URL.length);
const BASE_PHONE = '+7 (916) 926-96-66';
const SECOND_PHONE = '+7 (915) 018-27-74';

const DOMAIN_NAME = 'topimpech.ru';
const DOMAIN_NAME_LOCALE = 'ТопимПечь.ру';
const FULL_DOMAIN = `https://${DOMAIN_NAME}`;

const PRODUCT_PAGE_SUB_LABEL = `купить в интернет-магазине в Московской области товаров для бани и дома ${DOMAIN_NAME_LOCALE}`;
const PAGE_SUB_LABEL = `- интернет-магазин товаров для бани ${DOMAIN_NAME_LOCALE}`;
const META_PAGE_DESCRIPTION = (prodcutName: string) =>
	`${prodcutName} - купить по доступной цене в интернет-магазине печей, каминов, котлов, дымоходов и других товаров для вашей бани и дома ${DOMAIN_NAME_LOCALE}. ${prodcutName} - характеристика, фото, описание, похожие товары. Заказ товаров и консультация по телефону - ${BASE_PHONE}. Услуги замера и монтажа`;
const META_PAGE_DESCRIPTION_BASE = (prefix?: string) =>
	`${
		prefix ? prefix + '.' : ''
	} Интернет магазин ${DOMAIN_NAME_LOCALE} печей, каминов, котлов, дымоходов и других товаров для вашей бани и дома. Доставка по московской области. Услуги замера и монтажа. Заказ товаров и консультация по телефону - ${BASE_PHONE}`;

const PAGE_NOT_FOUND = 'Ошибка 404. Страница не была найдена.';

const OPENGRAPH_BASE = {
	locale: 'ru_RU',
	siteName: DOMAIN_NAME,
	type: 'website',
};

interface ServerSideURLProps {
	params: { [K: string]: string };
	searchParams: { [K: string]: string };
}

async function getSessionData(): Promise<UserSession | undefined> {
	const UserUID = cookies().get('UID_TOKEN');
	if (UserUID) {
		return getData(`${PROXY_URL}session/get`, { headers: { Cookie: cookies().toString() } });
	}
}

function GetCatalogView(): CatalogView {
	const view = (cookies().get(CATALOG_VIEW_COOKIE)?.value as CatalogView) ?? CatalogView.ROW;
	if (!Object.values(CatalogView).includes(view)) {
		return CatalogView.ROW;
	}
	return view;
}

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: `${DOMAIN_NAME_LOCALE} - интернет магазин товаров для бани, дома и строительства. Помогаем с подбором товаров`,
	description: META_PAGE_DESCRIPTION_BASE(),
	openGraph: { ...OPENGRAPH_BASE, title: 'Главная страница', url: FULL_DOMAIN, images: ['/api/images/logo/SiteLogo.png'] },
};

async function RootLayout({ children }: { children: ReactElement }) {
	const recomendationFetch = getData(`${PROXY_URL}products/session/recomendation/`, {
		cache: 'no-cache',
		headers: { Cookie: cookies().toString() },
	});
	const userAgentString = headers().get('user-agent') ?? '';

	const [categoriesData, userSession, recomendationData] = await Promise.all([fetchCategories(), getSessionData(), recomendationFetch]);

	return (
		<html lang="en">
			<head>
				<meta name="theme-color" media="(prefers-color-scheme: light)" content="white" />
				<script
					type="text/javascript"
					dangerouslySetInnerHTML={{
						__html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
					m[i].l=1*new Date();
					for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
					k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
					(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

					ym(94361143, "init", {
							clickmap:true,
							trackLinks:true,
							accurateTrackBounce:true
					});`,
					}}
				/>
			</head>
			<body>
				<noscript>
					<div>
						<img src="https://mc.yandex.ru/watch/94361143" style={{ position: 'absolute', left: '-9999px' }} alt="" />
					</div>
				</noscript>
				<GlobalContext
					productCount={categoriesData.totalProducts}
					view={GetCatalogView()}
					basePhoneNumber={[BASE_PHONE, SECOND_PHONE]}
					recomendation={recomendationData}
					baseAddress="1-я Вокзальная ул., 11, микрорайон Барыбино, Домодедово"
				>
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
	SITE_URL,
	SITE_URL_SLICED,
	OPENGRAPH_BASE,
	FULL_DOMAIN,
	PAGE_SUB_LABEL,
	META_PAGE_DESCRIPTION_BASE,

};
export default RootLayout;
