'use client';

import Link from 'next/link';
import { CategoryData, useCategoriesContext } from '../../context/Categories';
import { HistorySlider } from '../HistorySlider/HistorySlider';
import { RecomendationElement } from '../RecomendationElement/RecomendationElement';
import './HomePageElement.scss';
import { declOfProduct } from '../../utils';
import { ArrowGallery } from '../Shared/ArrowGallery/ArrowGallery';
import Slider from '../Shared/Slider';

function HomePageElementCategoryItem({ categoryData }: { categoryData: CategoryData }) {
	return (
		<Link className="home__page__categories__item" href={`catalog/${categoryData.slug}`}>
			<div className="home__page__categories__item__image__wrapper">
				<img src={`api/${categoryData.image?.path}`} className="home__page__categories__item__image" />
			</div>
			<div className="home__page__categories__item__info">
				<p className="home__page__categories__item__label">{categoryData.name}</p>
				<p className="home__page__categories__item__count">
					{categoryData.productCount} {declOfProduct(categoryData.productCount)}
				</p>
			</div>
		</Link>
	);
}

const banners = [
	{
		image: 'https://vezuviy.su/images/promo/17/БАННЕР_ВЕЗУВИЙ_гейзер2.jpg',
		url: '/',
	},
	{
		image: 'https://vezuviy.su/images/promo/17/БАННЕР_ВЕЗУВИЙ_гейзер2.jpg',
		url: '/',
	},
	{
		image: 'https://vezuviy.su/images/promo/17/БАННЕР_ВЕЗУВИЙ_гейзер2.jpg',
		url: '/',
	},
];

function BannersSlider() {
	return (
		<div className="home__page__banners__wrapper">
			<Slider SliderSettings={{ ItemsPerSlide: 1 }}>
				{banners.map((banner, i) => {
					return (
						<Slider.Item key={`home__page__banner__${i}`} className="home__page__banner__item">
							<Link href={banner.url} className="home__page__banner__link">
								<img src={banner.image} className="home__page__banner__image" />
							</Link>
						</Slider.Item>
					);
				})}
			</Slider>
		</div>
	);
}

function HomePageElementCategories() {
	const categories = useCategoriesContext();

	return (
		<div className="home__page__categories__wrapper">
			<div className="home__page__categories__header__wrapper">
				<h2 className="home__page__categories__header">Категории товаров</h2>
			</div>
			<div className="home__page__categories__content">
				{categories.categories.map((categoryData) => {
					return <HomePageElementCategoryItem key={`home__page__category__item__${categoryData.slug}`} categoryData={categoryData} />;
				})}
			</div>
		</div>
	);
}
function HomePageElement() {
	return (
		<div className="home__page__wrapper">
			<BannersSlider />
			<HomePageElementCategories />
			<RecomendationElement />
			<HistorySlider includeHeader={true} />
		</div>
	);
}

export { HomePageElement };
