import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/Cards/ProductCardGeneral.scss';
import '../styles/variables.scss';

import { ReactElement } from 'react';

import WidthLimiter from '../components/Shared/WidthLimiter/WidthLimiter';
import Layout from '../components/layout/layout';
import { BreadcrumbContext } from '../context/Breadcrumb/BreadcrumbContext';
import { CategoriesContext } from '../context/Categories/CategoriesContext';

const PROXY_URL = process.env.PROXY_URL;

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
	const categories = await getData(`${PROXY_URL}products/categories/`, { cache: 'force-cache', next: { revalidate: 3600 } });
	return (
		<html lang="en">
			<body>
				<CategoriesContext initialCategories={categories}>
					<BreadcrumbContext>
						<Layout>
							<WidthLimiter>{children}</WidthLimiter>
						</Layout>
					</BreadcrumbContext>
				</CategoriesContext>
			</body>
		</html>
	);
}

export type { ServerSideURLProps };
export { PROXY_URL };
export default RootLayout;
