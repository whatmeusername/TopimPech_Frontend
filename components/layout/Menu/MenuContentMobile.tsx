import { ReactElement, memo, useRef, useState } from 'react';
import './menu.scss';
import Link from 'next/link';

import { CategoriesColumn } from './GeneralElements';
import type { CategoryData } from './GeneralElements';
import { menuModalControl } from '../../../store/MenuModal';
import { AngleArrowIcon, ArrowIcon } from '../../IconsElements';
import { Capitalize } from '../../../utils/Capitalize';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { useCategoriesContext } from '../../../context/Categories';

interface BurgerData {
	parent: CategoryData;
	child: CategoryData[];
	previous: CategoryData | null;
}

const PrepareBurgersData = (categories: CategoryData[]): BurgerData[] => {
	categories = JSON.parse(JSON.stringify(categories));
	const result: BurgerData[] = [];

	const map = (category: CategoryData, parent?: CategoryData): void => {
		if (category.child.length > 0) {
			for (let i = 0; i < category.child.length; i++) {
				const child = category.child[i];
				map(child, category);
			}
		}
		result.push({ parent: category, child: category.child, previous: parent ?? null });
	};
	for (let i = 0; i < categories.length; i++) {
		map(categories[i]);
	}

	return result;
};

const MenuContentMobile = memo((): ReactElement => {
	const [currentBurger, setCurrentBurger] = useState<string | null>(null);
	const categories = useCategoriesContext()?.get();
	const burgerData = useRef<BurgerData[]>(PrepareBurgersData(categories));

	const CategoryItem = ({ category }: { category: CategoryData }): ReactElement => {
		return (
			<div className="mobile__category__item">
				<Link href={`/catalog/${category.slug}/`} className="mobile__category__item__link" onClick={() => menuModalControl.toggle(false)}>
					<div className="mobile__category__item__link__image__wrapper">
						<Image
							className="mobile__category__item__link__image"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.srcset = NO_IMAGE_SRC;
								target.src = NO_IMAGE_SRC;
							}}
							unoptimized={category.image.path.endsWith('.gif')}
							src={`/api${category.image.path}`}
							alt={category.name}
							width={40}
							height={40}
							quality={50}
							style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
						/>
					</div>
					<p className="mobile__category__item__link__text">{Capitalize(category.name)}</p>
				</Link>
				{category.child.length > 0 ? (
					<span className="mobile__category__item__arrow" onClick={() => setCurrentBurger(category.slug)}>
						<AngleArrowIcon className="mobile__category__item__arrow__icon" />
					</span>
				) : null}
			</div>
		);
	};

	const SubCategoryBurger = ({ category }: { category: BurgerData }): ReactElement => {
		return (
			<div className={'sub__category__burger__wrapper'}>
				<div className="menu__category__column">
					<div className="sub__category__burger__upper">
						<span
							className="sub__category__burger__back__wrapper"
							onClick={() => {
								setCurrentBurger(category.previous ? category.previous.slug : null);
							}}
						>
							<ArrowIcon className="sub__category__burger__back__wrapper__icon" />
						</span>

						<Link
							href={`/catalog/${category.parent.slug}/`}
							className="sub__category__burger__parent__link"
							onClick={() => menuModalControl.toggle(false)}
						>
							<p className="sub__category__burger__parent__link__text">{category.parent.name}</p>
						</Link>
					</div>
					{category.child.map((category) => {
						if (category.productCount === 0 || category?.image === undefined) return null;
						return <CategoryItem category={category} key={category.slug} />;
					})}
				</div>
			</div>
		);
	};

	const currentBurgerItems = currentBurger ? burgerData.current.find((b) => b.parent.slug === currentBurger) : null;
	return (
		<div className="main__category__column__wrapper">
			{currentBurger === null ? (
				<CategoriesColumn categories={categories} CategoryItem={CategoryItem} />
			) : (
				<SubCategoryBurger category={currentBurgerItems as BurgerData} />
			)}
		</div>
	);
});

MenuContentMobile.displayName = 'MenuContentMobile';

export { MenuContentMobile };
