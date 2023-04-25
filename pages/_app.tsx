import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/product/ProductCardGeneral.scss';

import Layout from '../components/layout/layout';
import WidthLimiter from '../components/WidthLimiter/WidthLimiter';
import type { AppProps } from 'next/app';

import { createContext, useContext } from 'react';
import { CentralModal } from '../components/CentralModal';
import { enableStaticRendering } from 'mobx-react-lite';
import { CategoriesContext, BreadcrumbContext, CentralModalContext } from '../context';

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
				<CentralModalContext>
					<Layout>
						<>
							<WidthLimiter>
								<Component {...pageProps} />
							</WidthLimiter>
							<CentralModal />
						</>
					</Layout>
				</CentralModalContext>
			</BreadcrumbContext>
		</CategoriesContext>
	);
}

export { PROXY_URL };
export default MyApp;
