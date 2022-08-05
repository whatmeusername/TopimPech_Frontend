import React, { memo, useRef } from 'react';
import styles from './menu.module.scss';
import Link from 'next/link';

import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useToggleModalContext } from './Menu';

import { CategoriesColumn } from './GeneralElements';
import type { CategoryData } from './GeneralElements';

type BurgerData = { parent: CategoryData | undefined; child: CategoryData[]; id: string };
const PrepareBurgersData = (categories: CategoryData[]): BurgerData[] => {
	let data: BurgerData[] = [];
	categories.forEach((category) => {
		if (category.child.length > 1) {
			category.child.forEach((category) => {
				category.child.forEach((category) => (category.child = []));
				data.push({ parent: category, child: category.child, id: category.slug });
			});
		}
		data.push({ parent: undefined, child: category.child, id: category.slug });
	});
	return data;
};

const MenuContentMobile = memo(({ categories }: { categories: CategoryData[] }): JSX.Element => {
	const closeModalFunction = useToggleModalContext();
	const SubModals = useRef<HTMLDivElement>(null!);
	const hasActiveBurger = useRef<boolean>(false);

	const ToggleBurger = (modalId: string | null) => {
		let modalList = SubModals.current;
		if (modalList) {
			if (modalId !== null) {
				let selectedModal = modalList.querySelector(`[data-parent-id="${modalId}"]`);

				if (hasActiveBurger.current === false) {
					selectedModal?.classList.add('modal__active__fade__in');
				} else selectedModal?.classList.remove('modal__active__fade__in');
				selectedModal?.classList.toggle('modal__active');

				hasActiveBurger.current = true;
			} else {
				let selectedModal = modalList.querySelector(`.modal__active`);
				selectedModal?.classList.remove('modal__active');

				hasActiveBurger.current = false;
			}
		}
	};

	const MainCategoryItem = ({ category }: { category: CategoryData }): JSX.Element => {
		return (
			<div className={styles.mobile__category__item}>
				<Link href={`/catalog/${category.slug}/`}>
					<a className={styles.mobile__category__item__link} onClick={() => closeModalFunction(false)}>
						{category.name}
					</a>
				</Link>
				{category.child.length > 0 ? (
					<span className={styles.mobile__category__item__arrow} onClick={() => ToggleBurger(category.slug)}>
						<FontAwesomeIcon icon={faAngleRight} />
					</span>
				) : (
					''
				)}
			</div>
		);
	};

	const SubCategoryItem = ({ category, parentSlug }: { category: CategoryData; parentSlug: string }): JSX.Element => {
		return (
			<div className={styles.mobile__category__item}>
				<Link href={`/catalog/${parentSlug}/${category.slug}/`}>
					<a onClick={() => closeModalFunction(false)} className={styles.mobile__category__item__link}>
						{category.name}
					</a>
				</Link>
				{category.child.length > 0 ? (
					<span className={styles.mobile__category__item__arrow} onClick={() => ToggleBurger(category.slug)}>
						<FontAwesomeIcon icon={faAngleRight} />
					</span>
				) : (
					''
				)}
			</div>
		);
	};

	const SubCategoryBurger = ({
		category,
		categoryId,
		parentCategory,
	}: {
		category: CategoryData[];
		categoryId: string;
		parentCategory: CategoryData | undefined;
	}) => {
		return (
			<div className={styles.sub__category__burger__wrapper} data-parent-id={categoryId}>
				<div
					className={styles.sub__category__burger__back__wrapper}
					onClick={() => ToggleBurger(parentCategory ? parentCategory.slug : null)}
				>
					<span className={styles.sub__category__burger__back__arrow}>
						<FontAwesomeIcon icon={faAngleLeft} />
					</span>
					<span>{parentCategory ? parentCategory.name : 'категории'}</span>
				</div>
				<div className={styles.menu__category__column}>
					{category.map((category) => {
						return <SubCategoryItem category={category} parentSlug={categoryId} key={category.slug} />;
					})}
				</div>
			</div>
		);
	};

	const subBurgers: BurgerData[] = PrepareBurgersData(categories);

	return (
		<>
			<div className={styles.main__category__column__wrapper}>
				<CategoriesColumn categories={categories} CategoryItem={MainCategoryItem} />
			</div>
			<div ref={SubModals} className={styles.burger__modals__list}>
				{subBurgers.map((burger) => {
					return (
						<SubCategoryBurger
							category={burger.child}
							categoryId={burger.id}
							parentCategory={burger.parent}
							key={`mobile-modal-${burger.id}`}
						/>
					);
				})}
			</div>
		</>
	);
});

MenuContentMobile.displayName = 'MenuContentMobile';

export default MenuContentMobile;
