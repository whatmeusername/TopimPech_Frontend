import Link from 'next/link';
import { ReactElement } from 'react';
import './ProductTypeSlider.scss';

import type { SiteInfoData } from '../interface';
import { Capitalize } from '../../../utils/Capitalize';
import { useMobile } from '../../../context/MobileContext/MobileContext';

function ProductTypeSlider({ SiteInfoData }: { SiteInfoData: SiteInfoData }): ReactElement | null {
	const isMobile = useMobile(768);
	if (!isMobile) return null;

	return (
		<div className="home__page__product__types__wrapper home__width__limiter">
			{SiteInfoData.ProductTypes.filter((t) => t.category).map((type) => {
				return (
					<Link className="home__page__product__types__item" key={type.slug} href={`/catalog/${type.category.slug}`}>
						<p className="home__page__product__types__item__text">{Capitalize(type.name)}</p>
					</Link>
				);
			})}
		</div>
	);
}

export { ProductTypeSlider };
