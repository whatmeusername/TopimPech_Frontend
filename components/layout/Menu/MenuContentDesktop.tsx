import { ReactElement } from 'react';
import './menu.scss';
import Link from 'next/link';

import type { CategoryData } from './GeneralElements';
import { menuModalControl } from '../../../store/MenuModal';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Capitalize } from '../../../utils/Capitalize';
import { SubCategoryColumn } from './SubCategoryColumn/SubCategoryColumn';
import { observer } from 'mobx-react-lite';
import { declOfProduct } from '../../../utils';

const MainCategoryItem = observer(({ category }: { category: CategoryData }): ReactElement | null => {
	if (category.productCount < 1) return null;

	return (
		<Link
			href={`/catalog/${category.slug}/`}
			onClick={() => menuModalControl.toggle(false)}
			onMouseEnter={() => menuModalControl.setCategory(category)}
			prefetch={false}
			className={`
				main__category__column__item
				${menuModalControl.selectedCategory === category.slug ? 'main__category__column__item__selected' : ''}
				`}
		>
			<div className="main__category__item__image__wrapper">
				<Image
					className="main__category__item__image"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.srcset = NO_IMAGE_SRC;
						target.src = NO_IMAGE_SRC;
					}}
					src={`/api${category.image?.path}`}
					alt={category.name}
					width={40}
					height={40}
					quality={50}
					style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
				/>
			</div>
			<p className="main__category__item__text">{Capitalize(category.name)}</p>
		</Link>
	);
});

const ManufacturersBlock = ({ category }: { category: CategoryData }): ReactElement | null => {
	if (category.manufacturers.length === 0) return null;
	return (
		<div className="sub__categories__manufacturers__wrapper">
			<div className="sub__categories__manufacturers__content">
				{category.manufacturers.map((manufacturer) => {
					if (!manufacturer.image) return null;
					return (
						<Link
							className="sub__categories__manufacturers__item"
							key={`sub__categories__manufacturers__item__${manufacturer.slug}`}
							href={`/catalog/${category.slug}/${manufacturer.slug}`}
							onClick={() => menuModalControl.toggle(false)}
							title={`Каталог товаров производителя ${manufacturer.slug}`}
						>
							<Image
								className="sub__categories__manufacturers__item__image"
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.srcset = NO_IMAGE_SRC;
									target.src = NO_IMAGE_SRC;
								}}
								src={`/api${manufacturer.image.path}`}
								alt={category.name}
								width={70}
								height={70}
								quality={50}
								style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
							/>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

const CategoriesBlock = observer(({ categories }: { categories: CategoryData[] }): ReactElement | null => {
	if (!menuModalControl.selectedCategory) return null;

	const category = categories.find((category) => category.slug === menuModalControl.selectedCategory);
	if (!category || category.child.length === 0) return null;

	return (
		<div className="sub__categories">
			<div className="sub__categories__header__wrapper">
				<p className="sub__categories__header">{Capitalize(category.name)}</p>
				<span className="sub__categories__product__count">
					{category.productCount} {declOfProduct(category.productCount)}
				</span>
			</div>
			<ManufacturersBlock category={category} />
			<div className="sub__categories_columns">
				{category.child.map((category) => {
					return <SubCategoryColumn data={category} key={category.slug} />;
				})}
			</div>
		</div>
	);
});

const MenuContentDesktop = ({ categories }: { categories: CategoryData[] }): ReactElement => {
	return (
		<div className="menu__content">
			<div className="main__categories">
				<div className="menu__category__column">
					{(categories ?? []).map((category) => {
						return <MainCategoryItem category={category} key={category.slug} />;
					})}
				</div>
			</div>
			<CategoriesBlock categories={categories} />
		</div>
	);
};

MenuContentDesktop.displayName = 'MenuContentDesktop';

export default MenuContentDesktop;
