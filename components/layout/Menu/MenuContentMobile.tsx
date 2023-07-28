import React, { memo, useRef } from 'react';
import './menu.scss';
import Link from 'next/link';

import { CategoriesColumn } from './GeneralElements';
import type { CategoryData } from './GeneralElements';
import { menuModalControl } from '../../../store/MenuModal';
import { AngleArrowIcon, ArrowIcon } from '../../IconsElements';

type BurgerData = { parent: CategoryData | undefined; child: CategoryData[]; id: string };
const PrepareBurgersData = (categories: CategoryData[]): BurgerData[] => {
	const data: BurgerData[] = [];
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
	const SubModals = useRef<HTMLDivElement>(null!);
	const hasActiveBurger = useRef<boolean>(false);

	const ToggleBurger = (modalId: string | null) => {
		const modalList = SubModals.current;
		if (modalList) {
			if (modalId !== null) {
				const selectedModal = modalList.querySelector(`[data-parent-id="${modalId}"]`);

				if (hasActiveBurger.current === false) {
					selectedModal?.classList.add('modal__active__fade__in');
				} else selectedModal?.classList.remove('modal__active__fade__in');
				selectedModal?.classList.toggle('modal__active');

				hasActiveBurger.current = true;
			} else {
				const selectedModal = modalList.querySelector('.modal__active');
				selectedModal?.classList.remove('modal__active');

				hasActiveBurger.current = false;
			}
		}
	};

	const MainCategoryItem = ({ category }: { category: CategoryData }): JSX.Element => {
		return (
			<div className="mobile__category__item">
				<Link href={`/catalog/${category.slug}/`} className="mobile__category__item__link" onClick={() => menuModalControl.toggle(false)}>
					{category.name}
				</Link>
				{category.child.length > 0 ? (
					<span className="mobile__category__item__arrow" onClick={() => ToggleBurger(category.slug)}>
						<AngleArrowIcon className="mobile__category__item__arrow__icon" />
					</span>
				) : (
					''
				)}
			</div>
		);
	};

	const SubCategoryItem = ({ category }: { category: CategoryData }): JSX.Element => {
		return (
			<div className="mobile__category__item">
				<Link href={`/catalog/${category.slug}/`} onClick={() => menuModalControl.toggle(false)} className="mobile__category__item__link">
					{category.name}
				</Link>
				{category.child.length > 0 ? (
					<span className="mobile__category__item__arrow" onClick={() => ToggleBurger(category.slug)}>
						<AngleArrowIcon className="mobile__category__item__arrow__icon" />
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
			<div className="sub__category__burger__wrapper" data-parent-id={categoryId}>
				<div className="sub__category__burger__back__wrapper" onClick={() => ToggleBurger(parentCategory ? parentCategory.slug : null)}>
					<span className="sub__category__burger__back__arrow">
						<ArrowIcon className="sub__category__burger__back__arrow__icon" />
					</span>
					<span>{parentCategory ? parentCategory.name : 'категории'}</span>
				</div>
				<div className="menu__category__column">
					{category.map((category) => {
						return <SubCategoryItem category={category} key={category.slug} />;
					})}
				</div>
			</div>
		);
	};

	const subBurgers: BurgerData[] = PrepareBurgersData(categories);

	return (
		<>
			<div className="main__category__column__wrapper">
				<CategoriesColumn categories={categories} CategoryItem={MainCategoryItem} />
			</div>
			<div ref={SubModals} className="burger__modals__list">
				{subBurgers.map((burger) => {
					return (
						<SubCategoryBurger category={burger.child} categoryId={burger.id} parentCategory={burger.parent} key={`mobile-modal-${burger.id}`} />
					);
				})}
			</div>
		</>
	);
});

MenuContentMobile.displayName = 'MenuContentMobile';

export default MenuContentMobile;
