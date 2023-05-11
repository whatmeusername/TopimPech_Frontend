import { useParams } from 'next/navigation';
import { ReactElement } from 'react';
import Slider from '../../Shared/Slider';
import Link from 'next/link';
import { useCategoriesContext } from '../../../context/Categories';
import { CategoryData } from '../../layout/Menu/GeneralElements';

import './ChildCategoriesElement.scss';

const ChildCategoriesChild = ({ category }: { category: CategoryData }): ReactElement => {
	return (
		<Link href={`/catalog/${category.slug}`}>
			<div className="child__category__wrapper">
				<div className="child__category__image__wrapper">
					<img
						className="child__category__image"
						src="/api/products/images/products/adapter-1-f450-mm-fantastic-700-vysokij/adapter-1-f450-mm-fantastic-700-vysokij_4.jpg"
					/>
				</div>
				<span className="child__category__label">{category.name}</span>
			</div>
		</Link>
	);
};

const ChildCategoriesElement = (): ReactElement | null => {
	const childCategories = useCategoriesContext();

	const { category } = useParams();

	const currentCategoryAtPage = childCategories?.find(category);
	console.log(currentCategoryAtPage);
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
