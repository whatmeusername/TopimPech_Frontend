import '../styles/globals.css';
import '../styles/FontFace/MuseoCyrl.scss';

// ---- Product Cards Styles ----
import '../components/CatalogComponents/product/ProductCardRow.scss';
import '../components/CatalogComponents/product/ProductCardGrid.scss';
import '../components/CatalogComponents/product/components/other/AddToCartButton.scss';
// ---- Catalog Elements Style ----
import '../components/CatalogPage/catalog/CatalogContainer.scss';
import '../components/CatalogPage/catalog/Filter/Filter.scss';
// ---- Elements Styles ----
import '../components/Slider/Slider.scss';

import Layout from '../components/layout/layout';
import WidthLimiter from '../components/WidthLimiter/WidthLimiter';
import type { AppProps } from 'next/app';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass, faBars, faEquals, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

import { CategoriesContext } from '../components/GlobalContext/Categories/Context';
import { BreadcrumbContext } from '../components/GlobalContext/Breadcrumb/Context';

config.autoAddCss = false;
library.add(faMagnifyingGlass, faBars, faEquals, faChartColumn, faHeart);

export const PROXY_URL = 'http://192.168.0.105:8000/';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<CategoriesContext>
			<BreadcrumbContext>
				<Layout>
					<WidthLimiter>
						<Component {...pageProps} />
					</WidthLimiter>
				</Layout>
			</BreadcrumbContext>
		</CategoriesContext>
	);
}

export default MyApp;
