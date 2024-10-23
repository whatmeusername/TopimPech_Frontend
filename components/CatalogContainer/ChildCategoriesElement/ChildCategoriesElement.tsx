import { ReactElement } from 'react';
import Slider from '../../Shared/Slider';
import Link from 'next/link';
import { Categories, useCategoriesContext } from '../../../context/Categories';
import { CategoryData } from '../../layout/Menu/GeneralElements';

import './ChildCategoriesElement.scss';
import { declOfProduct } from '../../../utils';
import { Number404 } from '../../Shared/Number404/Number404';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Capitalize } from '../../../utils/Capitalize';
import { Manufacturer } from '../../CatalogComponents/Cards/interface';
import { GetCategoryName } from '../../../utils/GetCategoryName';

const SliderChildCategoriesChild = ({ category, manufacturer }: { category: CategoryData; manufacturer?: Manufacturer }): ReactElement | null => {
	if (category.productCount === 0 || category.image === undefined) return null;
	return (
		<Link href={`/catalog/${category.slug}${manufacturer ? `/${manufacturer.slug}` : ''}`}>
			<div className="child__category__wrapper">
				{category.image ? (
					<div className="child__category__image__wrapper">
						<Image
							className="child__category__image"
							src={`/api${category.image.path}`}
							alt={category.name}
							loading="lazy"
							quality={65}
							width={50}
							height={50}
							priority={false}
							style={{ objectFit: 'contain', maxInlineSize: '100%' }}
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.srcset = NO_IMAGE_SRC;
								target.src = NO_IMAGE_SRC;
							}}
						/>
					</div>
				) : (
					<Number404 size={'small'} />
				)}
				<div className="child__category__info__wrapper">
					<p className="child__category__label">{Capitalize(category.name)}</p>
					<p className="child__category__count">
						{category.productCount} {declOfProduct(category.productCount)}
					</p>
				</div>
			</div>
		</Link>
	);
};

const SliderChildCategoriesElement = ({ categories, manufacturer }: { categories: CategoryData; manufacturer?: Manufacturer }): ReactElement => {
	return (
		<div className="child__categories__wrapper">
			<Slider SliderSettings={{ ItemsPerSlide: 'auto' }}>
				{categories.child.map((child) => {
					return (
						<Slider.Item key={`categories__child__${child.slug}`}>
							<SliderChildCategoriesChild category={child} manufacturer={manufacturer} />
						</Slider.Item>
					);
				})}
			</Slider>
		</div>
	);
};

const PrimaryChildCategoriesChild = ({ category, manufacturer }: { category: CategoryData; manufacturer?: Manufacturer }): ReactElement | null => {
	if (category.productCount === 0 || category.image === undefined) return null;
	return (
		<Link className="block__child__categories__item" href={`/catalog/${category.slug}${manufacturer ? `/${manufacturer.slug}` : ''}`}>
			<div className="block__child__categories__item__image__wrapper">
				<Image
					className="block__child__categories__item__image"
					onError={(e) => {
						const target = e.target as HTMLImageElement;
						target.srcset = NO_IMAGE_SRC;
						target.src = NO_IMAGE_SRC;
					}}
					src={`/api${category.image.path}`}
					alt={category.name}
					width={120}
					height={120}
					quality={60}
					style={{ objectFit: 'contain', maxInlineSize: '100%' }}
				/>
			</div>
			<h3 className="block__child__categories__item__text">{category.name}</h3>
		</Link>
	);
};

const PrimaryChildCategoriesElement = ({
	categories,
	manufacturer,
}: {
	categories: CategoryData | CategoryData[];
	manufacturer?: Manufacturer;
}): ReactElement => {
	const childs = Array.isArray(categories) ? categories : categories.child;
	return (
		<div className="block__child__categories__wrapper">
			<div className="block__child__categories__content">
				{childs.map((child) => {
					return <PrimaryChildCategoriesChild key={`categories__child__${child.slug}`} category={child} manufacturer={manufacturer} />;
				})}
			</div>
		</div>
	);
};

const ChildCategoriesElement = ({
	isInner,
	category,
	manufacturer,
	pageHeader,
	isManufacturerPage,
}: {
	isInner: boolean;
	category: string;
	manufacturer?: Manufacturer;
	pageHeader: string;
	isManufacturerPage?: boolean;
}): ReactElement | null => {
	const childCategories = useCategoriesContext();
	let currentCategoryAtPage;

	const MapManufacturerCategories = (data: CategoryData | CategoryData[]): CategoryData | CategoryData[] => {
		if (!manufacturer && pageHeader) return data;
		pageHeader = pageHeader.toLowerCase();
		const newChilds = [];
		const childs = Array.isArray(data) ? data : data.child;
		for (let i = 0; i < childs.length; i++) {
			pageHeader = pageHeader.toLowerCase();
			const currentChild = childs[i];
			currentChild.name = GetCategoryName({ main: currentChild.name, manufacturer: manufacturer?.name });

			if (currentChild.name === pageHeader) {
				newChilds.push(
					...currentChild.child
						.filter((c) => c.manufacturers.find((m) => m.slug === manufacturer?.slug) !== undefined)
						.map((child) => {
							child.name = GetCategoryName({ main: child.name, manufacturer: manufacturer?.name });
							return child;
						}),
				);
			} else {
				newChilds.push(currentChild);
			}
		}
		if (!Array.isArray(data)) {
			data.child = newChilds;
			return data;
		}
		return newChilds;
	};

	if (isManufacturerPage && manufacturer) {
		currentCategoryAtPage = (JSON.parse(JSON.stringify(childCategories)) as Categories).categories.filter(
			(c) => c.manufacturers.find((m) => m.slug === manufacturer.slug) !== undefined,
		);
		MapManufacturerCategories(currentCategoryAtPage);
		return currentCategoryAtPage.length > 0 ? (
			<div className="container__child__categories__wrapper">
				<h2 className="container__child__categories__header">Категории в каталоге</h2>
				<PrimaryChildCategoriesElement categories={currentCategoryAtPage} manufacturer={manufacturer} />
			</div>
		) : null;
	} else {
		currentCategoryAtPage = childCategories?.find(category);
		if (!isManufacturerPage && currentCategoryAtPage && manufacturer) {
			currentCategoryAtPage.child = currentCategoryAtPage.child.filter(
				(c) => c.manufacturers.find((m) => m.slug === manufacturer.slug) !== undefined,
			);
			MapManufacturerCategories(currentCategoryAtPage);
		}
	}

	const hasParent = currentCategoryAtPage?.parentCategory && currentCategoryAtPage?.parentCategory !== null;
	if (!currentCategoryAtPage || currentCategoryAtPage.child.length < 1) return null;
	else if (!isInner && !hasParent) return <PrimaryChildCategoriesElement categories={currentCategoryAtPage} manufacturer={manufacturer} />;
	else if (isInner && hasParent) return <SliderChildCategoriesElement categories={currentCategoryAtPage} manufacturer={manufacturer} />;
	return null;
};

export { ChildCategoriesElement };
