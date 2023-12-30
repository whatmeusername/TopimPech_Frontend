'use client';

import { HistorySlider } from '../HistorySlider/HistorySlider';
import { RecomendationElement } from '../RecomendationElement/RecomendationElement';
import { AboutMontageElement } from './AboutMontageElement/AboutMontageElement';
import { AboutStoreElement } from './AboutStoreElement/AboutStoreElement';
import { BannersSlider } from './BannersSlider/BannersSlider';
import './HomePageElement.scss';
import { HomePageElementCategories } from './HomePageElementCategories/HomePageElementCategories';
import { ManufacturesBlock } from './ManufacturesBlock/ManufacturesBlock';
import { ProductTagSlider } from './ProductTagSlider/ProductTagSlider';

import type { SiteInfoData } from './interface';

import { ReactElement } from 'react';

function HomePageElement({ SiteInfoData }: { SiteInfoData: SiteInfoData }): ReactElement {
	return (
		<div className="home__page__wrapper">
			<BannersSlider />
			<div className="home__page__wrapper__content">
				<AboutStoreElement />
				<HomePageElementCategories />
				<AboutMontageElement OurWorksData={SiteInfoData.OurWorks} />
				{SiteInfoData.ProductsTags?.length > 0 ? <ProductTagSlider ProductTagData={SiteInfoData.ProductsTags[0]} /> : null}
				<ManufacturesBlock ManufacturerData={SiteInfoData.manufacturerData} />
				<RecomendationElement className={'home__width__limiter'} />
				<HistorySlider includeHeader={true} className={'home__width__limiter'} />
			</div>
		</div>
	);
}

export { HomePageElement };
