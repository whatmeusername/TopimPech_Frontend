import '../styles/globals.scss';
import '../styles/FontFace/MuseoCyrl.scss';
import '../components/CatalogComponents/product/ProductCardGeneral.scss';

import Layout from '../components/layout/layout';
import WidthLimiter from '../components/WidthLimiter/WidthLimiter';
import type { AppProps } from 'next/app';

import { CategoriesContext } from '../components/GlobalContext/Categories/Context';
import { BreadcrumbContext } from '../components/GlobalContext/Breadcrumb/Context';

import { store, persistor } from '../store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createContext, useContext } from 'react';

const PROXY_URL = 'http://172.20.10.3:8000/';

export const PagePropsContext = createContext<any>(null!);
export const usePagePropsContext = () => {
	return useContext(PagePropsContext);
};

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CategoriesContext>
			<BreadcrumbContext>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<Layout>
							<WidthLimiter>
								<Component {...pageProps} />
							</WidthLimiter>
						</Layout>
					</PersistGate>
				</Provider>
			</BreadcrumbContext>
		</CategoriesContext>
	);
}

export { PROXY_URL };
export default MyApp;
