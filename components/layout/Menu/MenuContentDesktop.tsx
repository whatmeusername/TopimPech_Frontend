import { useState, memo } from 'react';
import './menu.scss';
import Link from 'next/link';

import { useToggleModalContext } from './Menu';

import { CategoriesColumn } from './GeneralElements';
import type { CategoryData } from './GeneralElements';

const MenuContentDesktop = memo(({ categories }: { categories: CategoryData[] }): JSX.Element => {
	const closeModalFunction = useToggleModalContext();
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const MainCategoryItem = ({ category }: { category: CategoryData }): JSX.Element => {
		return (
			<div
				className={`
					main__category__column__item
					${selectedCategory === category.slug ? 'main__category__column__item__selected' : ''}
					`}
				onMouseEnter={() => setSelectedCategory(category.slug)}
			>
				<Link href={`/catalog/${category.slug}/`} onClick={() => closeModalFunction(false)}>
					{category.name}
				</Link>
			</div>
		);
	};

	function SubCategoryColumn({ data }: { data: CategoryData }): JSX.Element {
		function SubCategoryItem({ data, className }: { data: CategoryData; className: string }): JSX.Element {
			return (
				<Link href={`/catalog/${data.slug}`} onClick={() => closeModalFunction(false)} className={className}>
					{data.name}
				</Link>
			);
		}

		return (
			<div className="sub__categories__column">
				<SubCategoryItem data={data} className="sub__categories__column__item" />
				{data?.child ? (
					<div className="sub__categories__column__sub__wrapper">
						{data.child.map((child) => {
							return <SubCategoryItem data={child} className="sub__categories__column__item__sub" key={child.slug} />;
						})}
					</div>
				) : (
					''
				)}
			</div>
		);
	}

	function CategoriesBlock({ categories }: { categories: CategoryData[] }): JSX.Element {
		const category = categories.find((category) => category.slug === selectedCategory);

		return (
			<div className="sub__categories_columns">
				{category?.child?.map((category) => {
					return <SubCategoryColumn data={category} key={category.slug} />;
				})}
			</div>
		);
	}

	return (
		<div className="menu__content">
			<div className="main__categories">
				<CategoriesColumn categories={categories} CategoryItem={MainCategoryItem} />
			</div>
			{selectedCategory ? (
				<div className="sub__categories">
					<CategoriesBlock categories={categories} />
				</div>
			) : (
				''
			)}
		</div>
	);
});

MenuContentDesktop.displayName = 'MenuContentDesktop';

export default MenuContentDesktop;
