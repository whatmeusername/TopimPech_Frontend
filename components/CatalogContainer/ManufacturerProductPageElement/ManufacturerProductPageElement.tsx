import { ReactElement } from 'react';
import { useCategoriesContext } from '../../../context/Categories';
import { Capitalize } from '../../../utils/Capitalize';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import Slider from '../../Shared/Slider';
import { NO_IMAGE_SRC } from '../../const';
import Image from 'next/image';
import './ManufacturerProductPageElement.scss';
import Link from 'next/link';

function ManufacturerProductPageElement({ category }: { category: string }): ReactElement | null {
	const childCategories = useCategoriesContext();
	const currentCategoryAtPage = childCategories?.find(category);

	const hasParent = currentCategoryAtPage?.parentCategory !== undefined && currentCategoryAtPage?.parentCategory !== null;

	if (!currentCategoryAtPage || hasParent) return null;
	return (
		<div className="product__page__manufacturer__wrapper">
			<ThinBreakLine />
			<div className="product__page__manufacturer__content">
				<div className="product__page__manufacturer__header__wrapper">
					<h2 className="product__page__manufacturer__header">Производители</h2>
				</div>
				<Slider SliderSettings={{ ItemsPerSlide: 'auto', returnToOtherSide: true }}>
					{currentCategoryAtPage.manufacturers.map((manufacturer) => {
						return (
							<Slider.Item className="product__page__manufacturer__item" key={`product__page__manufacturer__item__${manufacturer.slug}`}>
								<Link className="product__page__manufacturer__item__content" href={`/catalog/${currentCategoryAtPage.slug}/${manufacturer.slug}/`}>
									{manufacturer.image ? (
										<div className="product__page__manufacturer__item__image__wrapper">
											<Image
												className="product__page__manufacturer__item__image"
												onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
												src={`/api${manufacturer.image.path}`}
												alt={manufacturer.name}
												width={160}
												height={160}
												style={{ objectFit: 'contain', maxInlineSize: '100%' }}
											/>
										</div>
									) : (
										<p className="product__page__manufacturer__item__label">{Capitalize(manufacturer.name)}</p>
									)}
								</Link>
							</Slider.Item>
						);
					})}
				</Slider>
			</div>
		</div>
	);
}

export { ManufacturerProductPageElement };
