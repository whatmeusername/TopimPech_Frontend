import { useParams } from 'next/navigation';
import { ReactElement } from 'react';
import Slider from '../../Shared/Slider';
import Link from 'next/link';
import { useCategoriesContext } from '../../../context/Categories';
import { CategoryData } from '../../layout/Menu/GeneralElements';

import './ChildCategoriesElement.scss';
import { declOfProduct } from '../../../utils';

const ChildCategoriesChild = ({ category }: { category: CategoryData }): ReactElement => {
	return (
		<Link href={`/catalog/${category.slug}`}>
			<div className="child__category__wrapper">
				<div className="child__category__image__wrapper">
					<img className="child__category__image" src="/api/images/products/adapter-1-f450-mm-fantastic-700-vysokij/0.jpg" alt={category.name} />
				</div>
				<div className="child__category__info__wrapper">
					<p className="child__category__label">{category.name}</p>
					<p className="child__category__count">
						{category.productCount} {declOfProduct(category.productCount)}
					</p>
				</div>
			</div>
		</Link>
	);
};

const ChildCategoriesElement = (): ReactElement | null => {
	const childCategories = useCategoriesContext();

	const { category } = useParams();

	const currentCategoryAtPage = childCategories?.find(category);
	if (!currentCategoryAtPage || currentCategoryAtPage.child.length < 1) return null;

	return (
		<div className="child__categories__wrapper">
			<Slider SliderSettings={{ ItemsPerSlide: 'auto' }}>
				<>
					{currentCategoryAtPage.child.map((child) => {
						return (
							<Slider.Item key={`categories__child__${child.slug}`}>
								<ChildCategoriesChild category={child} />
							</Slider.Item>
						);
					})}
				</>
			</Slider>
		</div>
	);
};

export { ChildCategoriesElement };
