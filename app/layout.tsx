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
import { HeadFavicon } from '../components/HeadComponents/HeadFavicon';
import {
	PROXY_URL,
	SITE_URL,
	META_PAGE_DESCRIPTION_BASE,
	OPENGRAPH_BASE,
	FULL_DOMAIN,
	PhoneNumbersData,
	DOMAIN_NAME_LOCALE,
} from '../const/siteinfo.const';

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
				<HeadFavicon />
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
					PhoneNumbersData={PhoneNumbersData}
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

export default RootLayout;
