import Link from 'next/link';
import { ReactElement } from 'react';
import './ProductTypeSlider.scss';

import type { SiteInfoData } from '../interface';
import { Capitalize } from '../../../utils/Capitalize';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { useCategoriesContext } from '../../../context/Categories';

function ProductTypeSlider({ SiteInfoData }: { SiteInfoData: SiteInfoData }): ReactElement | null {
	const isMobile = useMobile(768);
	const CategoriesData = useCategoriesContext();
	if (!isMobile) return null;

	return (
		<div className="home__page__product__types__wrapper home__width__limiter">
			{SiteInfoData.ProductTypes.filter((t) => t.category).map((type) => {
				const CategoryData = CategoriesData.find(type.category.slug);
				if (CategoryData && CategoryData.productCount === 0) return null;
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
