import { useState, memo, ReactElement } from 'react';
import './menu.scss';
import Link from 'next/link';

import { CategoriesColumn } from './GeneralElements';
import type { CategoryData } from './GeneralElements';
import { menuModalControl } from '../../../store/MenuModal';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Capitalize } from '../../../utils/Capitalize';

const MenuContentDesktop = memo(({ categories }: { categories: CategoryData[] }): JSX.Element => {
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	const MainCategoryItem = ({ category }: { category: CategoryData }): JSX.Element => {
		return (
			<Link
				href={`/catalog/${category.slug}/`}
				onClick={() => menuModalControl.toggle(false)}
				prefetch={false}
				className={`
					main__category__column__item
					${selectedCategory === category.slug ? 'main__category__column__item__selected' : ''}
					`}
				onMouseEnter={() => setSelectedCategory(category.slug)}
			>
				<div className="main__category__item__image__wrapper">
					<Image
						className="main__category__item__image"
						onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
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
	};

	function SubCategoryItem({ data, className, showCount }: { data: CategoryData; className: string; showCount?: boolean }): JSX.Element {
		return (
			<Link href={`/catalog/${data.slug}`} onClick={() => menuModalControl.toggle(false)} className={className} prefetch={false}>
				<span className={`${className}__text`}>{data.name}</span>
				{showCount ? <span className={'sub__categories__column__item__count'}>{data.productCount}</span> : null}
			</Link>
		);
	}

	function SubCategoryColumn({ data }: { data: CategoryData }): ReactElement {
		return (
			<div className="sub__categories__column">
				<SubCategoryItem data={data} className="sub__categories__column__item" showCount={true} />
				{data.child.length > 0 ? (
					<div className="sub__categories__column__sub__wrapper">
						{data.child.map((child) => {
							return <SubCategoryItem data={child} className="sub__categories__column__item__sub" key={child.slug} showCount={false} />;
						})}
					</div>
				) : null}
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
