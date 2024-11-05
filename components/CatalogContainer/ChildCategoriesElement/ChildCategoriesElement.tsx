import { ReactElement } from 'react';
import Slider from '../../Shared/Slider';
import Link from 'next/link';
import { useCategoriesContext } from '../../../context/Categories';
import { CategoryData } from '../../layout/Menu/GeneralElements';

import './ChildCategoriesElement.scss';
import { declOfProduct } from '../../../utils';
import { Number404 } from '../../Shared/Number404/Number404';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Capitalize } from '../../../utils/Capitalize';
import { Manufacturer } from '../../CatalogComponents/Cards/interface';
import { useSiteInfoContext } from '../../../context/GlobalContext/GlobalContext';
import { ManufacturerCategoryData, ManufacturerRootCategoryData } from '../../HomePageElement/interface';

const SliderChildCategoriesChild = ({
	category,
	manufacturer,
}: {
	category: CategoryData | ManufacturerCategoryData;
	manufacturer?: Manufacturer;
}): ReactElement | null => {
	if (category.image === undefined) return null;
	const productCount = (category as any)?.productCount;
	return (
		<Link href={`/catalog/${category.slug}${manufacturer ? `/${manufacturer.slug}` : ''}`}>
			<div className="child__category__wrapper">
				{category.image ? (
					<div className="child__category__image__wrapper">
						<Image
							className="child__category__image"
							src={`/api${category.image?.path}`}
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
					{productCount ? (
						<p className="child__category__count">
							{productCount} {declOfProduct(productCount)}
						</p>
					) : null}
				</div>
			</div>
		</Link>
	);
};

const SliderChildCategoriesElement = ({
	categories,
	manufacturer,
}: {
	categories: CategoryData[] | ManufacturerCategoryData[];
	manufacturer?: Manufacturer;
}): ReactElement => {
	return (
		<div className="child__categories__wrapper">
			<Slider SliderSettings={{ ItemsPerSlide: 'auto' }}>
				{categories.map((category) => {
					return (
						<Slider.Item key={`categories__child__${category.slug}`}>
							<SliderChildCategoriesChild category={category} manufacturer={manufacturer} />
						</Slider.Item>
					);
				})}
			</Slider>
		</div>
	);
};

const PrimaryChildCategoriesChild = ({
	category,
	manufacturer,
}: {
	category: CategoryData | ManufacturerCategoryData | ManufacturerRootCategoryData;
	manufacturer?: Manufacturer;
}): ReactElement | null => {
	if (category.image === undefined) return null;

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
					src={`/api${category.image?.path}`}
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
	categories: CategoryData | CategoryData[] | ManufacturerCategoryData[] | ManufacturerRootCategoryData[];
	manufacturer?: Manufacturer;
}): ReactElement => {
	const childs = Array.isArray(categories) ? categories : ((categories as CategoryData).child as CategoryData[]);
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
	isManufacturerPage,
}: {
	isInner: boolean;
	category: string;
	manufacturer?: Manufacturer;
	pageHeader: string;
	isManufacturerPage?: boolean;
}): ReactElement | null => {
	const childCategories = useCategoriesContext();
	const SiteInfo = useSiteInfoContext();

	if (isManufacturerPage && manufacturer) {
		const ManufacturerCategoryData = SiteInfo.manufacturerData.find((m) => m.slug === manufacturer.slug)?.rootCategories;
		return ManufacturerCategoryData && ManufacturerCategoryData.length > 1 ? (
			<div className="container__child__categories__wrapper">
				<h2 className="container__child__categories__header">Категории в каталоге</h2>
				<PrimaryChildCategoriesElement categories={ManufacturerCategoryData} manufacturer={manufacturer} />
			</div>
		) : null;
	} else {
		if (!isManufacturerPage && manufacturer && !isInner) {
			const ManufacturerCategoryData = SiteInfo.manufacturerData.find((m) => m.slug === manufacturer.slug)?.categories;
			const Parent = ManufacturerCategoryData?.find((c) => c.slug === category);
			if (ManufacturerCategoryData && Parent) {
				const Childs = ManufacturerCategoryData.filter((c) => c.parentID === Parent.id);
				return Childs.length > 1 ? <PrimaryChildCategoriesElement categories={Childs} manufacturer={manufacturer} /> : null;
			}
			return null;
		} else if (!manufacturer) {
			const currentCategoryAtPage = childCategories?.find(category);
			const hasParent = currentCategoryAtPage?.parentCategory && currentCategoryAtPage?.parentCategory !== null;
			if (!currentCategoryAtPage || (manufacturer && currentCategoryAtPage.child.length < 2) || currentCategoryAtPage.child.length < 1) return null;
			else if (!isInner && !hasParent) return <PrimaryChildCategoriesElement categories={currentCategoryAtPage.child} manufacturer={manufacturer} />;
			else if (isInner && hasParent) return <SliderChildCategoriesElement categories={currentCategoryAtPage.child} manufacturer={manufacturer} />;
			return null;
		}
	}
	return null;
};

export { ChildCategoriesElement };
