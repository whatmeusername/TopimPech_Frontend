import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/Cards/ProductCardGeneral.scss';
import '../styles/variables.scss';

import Layout from '../components/layout/layout';
import WidthLimiter from '../components/Shared/WidthLimiter/WidthLimiter';
import type { AppProps } from 'next/app';

import { createContext, useContext } from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import { CategoriesContext } from '../context/Categories';
import { BreadcrumbContext } from '../context/Breadcrumb';

const PROXY_URL = process.env.PROXY_URL;

export const PagePropsContext = createContext<any>(null!);
export const usePagePropsContext = () => {
	return useContext(PagePropsContext);
};

enableStaticRendering(typeof window === 'undefined');

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CategoriesContext>
			<BreadcrumbContext>
				<Layout>
					<>
						<WidthLimiter>
							<Component {...pageProps} />
						</WidthLimiter>
					</>
				</Layout>
			</BreadcrumbContext>
		</CategoriesContext>
	);
}

export { PROXY_URL };
export default MyApp;
