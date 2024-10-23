import Link from 'next/link';
import { useCategoriesContext } from '../../../context/Categories/CategoriesContext';
import { declOfProduct } from '../../../utils';
import { NO_IMAGE_SRC } from '../../const';
import { CategoryData } from '../../layout/Menu/GeneralElements';
import Image from 'next/image';
import './HomePageElementCategories.scss';
import { ReactElement } from 'react';

function HomePageElementCategoryItem({ categoryData }: { categoryData: CategoryData }): ReactElement | null {
	return (
		<Link className="home__page__categories__item" href={`catalog/${categoryData.slug}`}>
			<div className="home__page__categories__item__info">
				<p className="home__page__categories__item__label">{categoryData.name}</p>
				<p className="home__page__categories__item__count">
					{categoryData.productCount} {declOfProduct(categoryData.productCount)}
				</p>
			</div>
			<div className="home__page__categories__item__image__wrapper">
				<Image
					src={`/api${categoryData.image.path}`}
					className="home__page__categories__item__image"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.srcset = NO_IMAGE_SRC;
						target.src = NO_IMAGE_SRC;
					}}
					unoptimized={categoryData.image.path.endsWith('.gif')}
					alt={categoryData.name}
					width={210}
					height={210}
					style={{ objectFit: 'contain', maxInlineSize: '100%' }}
				/>
			</div>
		</Link>
	);
}

function HomePageElementCategories() {
	const categories = useCategoriesContext();

	return (
		<div className="home__page__categories__wrapper home__width__limiter">
			<div className="home__page__categories__content__wrapper">
				<div className="home__page__categories__content">
					{categories.categories.map((categoryData) => {
						if (categoryData.productCount === 0 || categoryData?.image === undefined) return null;
						return <HomePageElementCategoryItem key={`home__page__category__item__${categoryData.slug}`} categoryData={categoryData} />;
					})}
				</div>
			</div>
		</div>
	);
}

export { HomePageElementCategories };
