'use client';

import './FavouritesElement.scss';

import { observer } from 'mobx-react-lite';
import { ReactElement } from 'react';
import { FavouritesItem } from '../../store/favourites';
import ProductImageGallery from '../CatalogComponents/HoverGallery/ProductGallery';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';
import Link from 'next/link';

import TrashBin from '../../public/OptionsIcons/TrashBin.svg';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import { useFavouritesProducts } from '../../context/MobxStoreContext/MobxStoreContext';
import { ComparisonButton } from '../CatalogComponents/ComparisonButton/ComparisonButton';
import { declOfNum } from '../../utils';
import { ToPreviousPageButton } from '../Shared/ToPreviousPageButton/ToPreviousPageButton';

import HeartNotFilled from '../../public/OptionsIcons/HeartNotFilled.svg';

const FavouritesItemDeleteBtn = ({ product }: { product: FavouritesItem }) => {
	const FavouritesProducts = useFavouritesProducts();

	return (
		<button className="product__card__option" onClick={() => FavouritesProducts.remove(product)}>
			<TrashBin className="product__card__option__icon" />
			<p className="product__card__option__label">Удалить</p>
		</button>
	);
};

const FavouritesItem = ({ product }: { product: FavouritesItem }): ReactElement => {
	return (
		<div className="favourites__item">
			<div className="favourites__item__main__content">
				<div className="favourites__item__gallery__wrapper">
					<ProductImageGallery images={product.images} urlStartsWith={'/api'} alt={product.name} />
				</div>
				<div className="favourites__item__content favourites__item__content__wrapper">
					<Link href={`/product/${product.article}/`} className="favourites__item__link">
						<h3 className="favourites__item__header">{product.name}</h3>
						<PriceElement sale={product.sale} price={product.price} />
					</Link>

					<div className="favourites__item__options">
						<FavouritesItemDeleteBtn product={product} />
						<ComparisonButton productData={product} withLabel={true} />
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
	const FavouritesProducts = useFavouritesProducts();

	const itHasItems = FavouritesProducts.items.length > 0;

	return (
		<div className="favourites__container">
			<ToPreviousPageButton />
			<div className="favourites__header__wrapper">
				<h1 className="favourites__header">{itHasItems ? 'Избранные товары' : 'В избранном пока что ничего нет'}</h1>
				{itHasItems ? (
					<span className="favourites__header__count">
						{FavouritesProducts.getCount()} {declOfNum(FavouritesProducts.getCount(), ['товар', 'товара', 'товаров'])}
					</span>
				) : null}
			</div>

			<div className={`favourites__items__wrapper ${!itHasItems ? 'favourites__items__wrapper__empty' : ''}`}>
				{itHasItems ? (
					<>
						{FavouritesProducts.items.map((product, i) => {
							return (
								<>
									<FavouritesItem product={product} key={`favourites__item__${product.article}`} />
									{i + 1 !== FavouritesProducts.items.length ? <ThinBreakLine /> : null}
								</>
							);
						})}
					</>
				) : (
					<p className="favourites__items__empty__label">
						Добавляйте понравившийся вам товары в избранное с помощью <HeartNotFilled className="favourites__items__empty__label__icon" />
					</p>
				)}
			</div>
		</div>
	);
});

export { FavouritesElement };
