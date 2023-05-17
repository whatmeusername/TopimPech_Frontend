'use client';

import './FavouritesElement.scss';

import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';
import { favouritesProducts, FavouritesItem } from '../../store/favourites';
import ProductImageGallery from '../CatalogComponents/HoverGallery/ProductGallery';

const FavouritesItem = ({ product }: { product: FavouritesItem }): ReactElement => {
	return (
		<div className="favourites__item">
			<div className="favourites__item__gallery__wrapper">
				<ProductImageGallery images={product?.images} urlStartsWith={'/api'} />
			</div>
			<div className="favourites__item__main__content">
				<p>{product.name}</p>
				<div className="favourites__item__options"></div>
			</div>
		</div>
	);
};

const FavouritesElement = observer((): ReactElement => {
	return (
		<div className="favourites__container">
			<div className="favourites__header">
				<h1>Избранные товары {favouritesProducts.getCount()}</h1>
			</div>
			<div className="favourites__items__wrapper">
				{favouritesProducts.items.map((product) => {
					return <FavouritesItem product={product} />;
				})}
			</div>
		</div>
	);
});

export { FavouritesElement };
