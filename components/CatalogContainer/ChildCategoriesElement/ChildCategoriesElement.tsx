import { useParams } from 'next/navigation';
import { ReactElement } from 'react';
import Slider from '../../Shared/Slider';
import Link from 'next/link';
import { useCategoriesContext } from '../../../context/Categories';
import { CategoryData } from '../../layout/Menu/GeneralElements';

import './ChildCategoriesElement.scss';
import { declOfProduct } from '../../../utils';
import { Number404 } from '../../Shared/Number404/Number404';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Capitalize } from '../../../utils/Capitalize';

const SliderChildCategoriesChild = ({ category }: { category: CategoryData }): ReactElement => {
	return (
		<Link href={`/catalog/${category.slug}`}>
			<div className="child__category__wrapper">
				{category.image ? (
					<div className="child__category__image__wrapper">
						<Image
							className="child__category__image"
							src={`/api${category.image.path}`}
							alt={category.name}
							loading="lazy"
							quality={65}
							width={50}
							height={50}
							priority={false}
							style={{ objectFit: 'contain', maxInlineSize: '100%' }}
							onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
						/>
					</div>
				) : (
					<Number404 size={'small'} />
				)}
				<div className="child__category__info__wrapper">
					<p className="child__category__label">{Capitalize(category.name)}</p>
					<p className="child__category__count">
						{category.productCount} {declOfProduct(category.productCount)}
					</p>
				</div>
			</div>
		</Link>
	);
};

const SliderChildCategoriesElement = ({ categories }: { categories: CategoryData }): ReactElement => {
	return (
		<div className="child__categories__wrapper">
			<Slider SliderSettings={{ ItemsPerSlide: 'auto' }}>
				{categories.child.map((child) => {
					return (
						<Slider.Item key={`categories__child__${child.slug}`}>
							<SliderChildCategoriesChild category={child} />
						</Slider.Item>
					);
				})}
			</Slider>
		</div>
	);
};

const PrimaryChildCategoriesChild = ({ category }: { category: CategoryData }): ReactElement => {
	return (
		<Link className="block__child__categories__item" href={`/catalog/${category.slug}`}>
			<div className="block__child__categories__item__image__wrapper">
				<Image
					className="block__child__categories__item__image"
					onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
					src={`/api${category.image.path}`}
					alt={category.name}
					width={120}
					height={120}
					quality={60}
					style={{ objectFit: 'contain', maxInlineSize: '100%' }}
				/>
			</div>
			<h3 className="block__child__categories__item__text">{category.name}</h3>
		</Link>
	);
};

const PrimaryChildCategoriesElement = ({ categories }: { categories: CategoryData }): ReactElement => {
	return (
		<div className="block__child__categories__wrapper">
			<div className="block__child__categories__content">
				{categories.child.map((child) => {
					return <PrimaryChildCategoriesChild key={`categories__child__${child.slug}`} category={child} />;
				})}
			</div>
		</div>
	);
};

const ChildCategoriesElement = ({ isInner }: { isInner: boolean }): ReactElement | null => {
	const childCategories = useCategoriesContext();

	const { category } = useParams() as { category: string };

	const currentCategoryAtPage = childCategories?.find(category);
	const hasParent = currentCategoryAtPage?.parentCategory !== undefined && currentCategoryAtPage?.parentCategory !== null;

	if (!currentCategoryAtPage || currentCategoryAtPage.child.length < 1) return null;
	else if (!isInner && !hasParent) return <PrimaryChildCategoriesElement categories={currentCategoryAtPage} />;
	else if (isInner && hasParent) return <SliderChildCategoriesElement categories={currentCategoryAtPage} />;
	return null;
};

export { ChildCategoriesElement };
