import { useState, memo } from 'react';
import styles from './menu.module.scss';
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
					${styles.main__category__column__item}
					${selectedCategory === category.slug ? styles.main__category__column__item__selected : ''}
					`}
				onMouseEnter={() => setSelectedCategory(category.slug)}
			>
				<Link href={`/catalog/${category.slug}/`}>
					<a onClick={() => closeModalFunction(false)}>{category.name}</a>
				</Link>
			</div>
		);
	};

	function SubCategoryColumn({
		data,
		mainCategorySlug,
	}: {
		data: CategoryData;
		mainCategorySlug: string;
	}): JSX.Element {
		function SubCategoryItem({ data, className }: { data: CategoryData; className: string }): JSX.Element {
			return (
				<Link href={`/catalog/${mainCategorySlug}/${data.slug}`}>
					<a onClick={() => closeModalFunction(false)} className={className}>
						{data.name}
					</a>
				</Link>
			);
		}

		return (
			<div className={styles.sub__categories__column}>
				<SubCategoryItem data={data} className={styles.sub__categories__column__item} />
				{data?.child ? (
					<div className={styles.sub__categories__column__sub__wrapper}>
						{data.child.map((child) => {
							return (
								<SubCategoryItem
									data={child}
									className={styles.sub__categories__column__item__sub}
									key={child.slug}
								/>
							);
						})}
					</div>
				) : (
					''
				)}
			</div>
		);
	}

	function CategoriesBlock({
		categories,
		selectedCategory,
	}: {
		categories: CategoryData[];
		selectedCategory: string;
	}): JSX.Element {
		let category = categories.find((category) => category.slug === selectedCategory);

		return (
			<div className={styles.sub__categories_columns}>
				{category?.child?.map((category) => {
					return (
						<SubCategoryColumn data={category} mainCategorySlug={selectedCategory} key={category.slug} />
					);
				})}
			</div>
		);
	}

	return (
		<div className={styles.menu__content}>
			<div className={styles.main__categories}>
				<CategoriesColumn categories={categories} CategoryItem={MainCategoryItem} />
			</div>
			{selectedCategory ? (
				<div className={styles.sub__categories}>
					<CategoriesBlock categories={categories} selectedCategory={selectedCategory} />
				</div>
			) : (
				''
			)}
		</div>
	);
});

MenuContentDesktop.displayName = 'MenuContentDesktop';

export default MenuContentDesktop;
