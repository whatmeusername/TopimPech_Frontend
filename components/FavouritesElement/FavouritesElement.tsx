'use client';

import './FavouritesElement.scss';

import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';
import { favouritesProducts, FavouritesItem } from '../../store/favourites';
import ProductImageGallery from '../CatalogComponents/HoverGallery/ProductGallery';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';
import Link from 'next/link';

import TrashBin from '../../public/OptionsIcons/TrashBin.svg';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';

const FavouritesItemDeleteBtn = ({ product }: { product: FavouritesItem }) => {
	return (
		<button className="favourites__item__options__btn" onClick={() => favouritesProducts.remove(product)}>
			<TrashBin className="favourites__item__options__btn__icon" />
			<p className="favourites__item__options__btn__label">Удалить</p>
		</button>
	);
};

const FavouritesItem = ({ product }: { product: FavouritesItem }): ReactElement => {
	return (
		<div className="favourites__item">
			<div className="favourites__item__main__content">
				<div className="favourites__item__gallery__wrapper">
					<ProductImageGallery images={product?.images} urlStartsWith={'/api'} />
				</div>
				<div className="favourites__item__content favourites__item__content__wrapper">
					<Link href={`/product/${product.article}/`} className="favourites__item__link">
						<h3 className="favourites__item__header">{product.name}</h3>
						<PriceElement sale={product.sale} price={product.price} />
					</Link>

					<div className="favourites__item__options">
						<FavouritesItemDeleteBtn product={product} />
						<FavouritesItemDeleteBtn product={product} />
					</div>
				</div>
			</div>
			<div className="favourites__item__main__options favourites__item__content__wrapper">
				<PriceElement sale={product.sale} price={product.price} />
				<AddToCartButton article={product.article} />
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
				{favouritesProducts.items.map((product, i) => {
					return (
						<>
							<FavouritesItem product={product} key={`favourites__item__${product.article}`} />
							{i + 1 !== favouritesProducts.items.length ? <ThinBreakLine /> : null}
						</>
					);
				})}
			</div>
		</div>
	);
});

export { FavouritesElement };
