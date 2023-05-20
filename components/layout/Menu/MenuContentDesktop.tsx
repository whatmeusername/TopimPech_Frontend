import { useState, memo, ReactElement } from 'react';
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
			<Link
				href={`/catalog/${category.slug}/`}
				onClick={() => closeModalFunction(false)}
				prefetch={false}
				className={`
					main__category__column__item
					${selectedCategory === category.slug ? 'main__category__column__item__selected' : ''}
					`}
				onMouseEnter={() => setSelectedCategory(category.slug)}
			>
				{category.name}
			</Link>
		);
	};

	function SubCategoryColumn({ data }: { data: CategoryData }): JSX.Element {
		function SubCategoryItem({ data, className }: { data: CategoryData; className: string }): JSX.Element {
			return (
				<Link href={`/catalog/${data.slug}`} onClick={() => closeModalFunction(false)} className={className} prefetch={false}>
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

	function CategoriesBlock({ categories }: { categories: CategoryData[] }): ReactElement | null {
		const category = categories.find((category) => category.slug === selectedCategory);

		if (!category || category.child.length === 0) return null;

		return (
			<div className="sub__categories">
				<div className="sub__categories_columns">
					{category?.child?.map((category) => {
						return <SubCategoryColumn data={category} key={category.slug} />;
					})}
				</div>
			</div>
		);
	}

	return (
		<div className="menu__content">
			<div className="main__categories">
				<CategoriesColumn categories={categories} CategoryItem={MainCategoryItem} />
			</div>
			{selectedCategory ? <CategoriesBlock categories={categories} /> : null}
		</div>
	);
});

MenuContentDesktop.displayName = 'MenuContentDesktop';

export default MenuContentDesktop;
