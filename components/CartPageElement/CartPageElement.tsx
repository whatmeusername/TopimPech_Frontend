'use client';

import Image from 'next/image';

import axios from 'axios';
import { useState, useEffect, ReactElement } from 'react';
import { MappedProductsResponse, ProductData } from '../CatalogComponents/Cards/interface';
import './CartPageElement.scss';
import { ToPreviousPageButton } from '../Shared/ToPreviousPageButton/ToPreviousPageButton';
import { CartItem, UserProductCart } from '../../store';
import { DeleteIcon, MinusIcon, PlusIcon } from '../IconsElements';
import { useUserProductCart } from '../../context/MobxStoreContext/MobxStoreContext';
import { observer } from 'mobx-react-lite';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import { ComparisonButton } from '../CatalogComponents/ComparisonButton/ComparisonButton';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import Link from 'next/link';
import { declOfNum } from '../../utils';

interface MappedProductsResponseCart extends MappedProductsResponse {
	cart: null | CartItem[];
}

const CartClearButton = observer((): ReactElement => {
	const productCart = useUserProductCart();
	return (
		<button className="cart__clear__button" onClick={productCart.raw_items.length > 0 ? () => productCart.clear() : undefined}>
			<DeleteIcon className="cart__clear__button__icon" />
			<p className="cart__clear__button__label">очистить корзину</p>
		</button>
	);
});

const CartQuanityElement = observer(({ productData }: { productData: ProductData }): ReactElement => {
	const productCart = useUserProductCart();
	const cartItem = productCart.get(productData.article) as CartItem;
	return (
		<div className="cart__item__quanity__wrapper">
			<button
				className="cart__item__quanity__btn cart__item__quanity__card"
				onClick={() => productCart.decrement({ article: productData.article, count: 1 })}
			>
				<MinusIcon className="cart__item__quanity__btn__icon" />
			</button>
			<div className="cart__item__quanity__current__wrapper cart__item__quanity__card">
				<p className="cart__item__quanity__current">{cartItem.count}</p>
			</div>
			<button
				className="cart__item__quanity__btn cart__item__quanity__card"
				onClick={() => {
					productCart.increment({ article: productData.article, count: 1 });
				}}
			>
				<PlusIcon className="cart__item__quanity__btn__icon" />
			</button>
		</div>
	);
});

const CartDeleteItemButton = ({ productData }: { productData: ProductData }): ReactElement => {
	const productCart = useUserProductCart();
	return (
		<button className="product__card__option product__card__option__base" onClick={() => productCart.delete(productData.article)}>
			<DeleteIcon className="product__card__option__icon" />
			<p className="product__card__option__label">удалить</p>
		</button>
	);
};

const CartItemElement = ({ productData }: { productData: ProductData }): ReactElement => {
	return (
		<div className="cart__page__cart__item">
			<div className="cart__item__main">
				<div className="cart__item__image__wrapper">
					<Image
						className="cart__item__image"
						src={`/api${productData.images[0].path}`}
						alt={productData.name}
						width={150}
						height={150}
						style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
					/>
				</div>
				<div className="cart__item__main__info">
					<Link href={`/product/${productData.article}`} className="cart__item__link">
						<p className="cart__item__link__label">{productData.name}</p>
					</Link>
					<ThinBreakLine />
					<div className="cart__item__options">
						<ComparisonButton productData={productData} withLabel={true} useBaseStyle={true} />
						<CartDeleteItemButton productData={productData} />
					</div>
				</div>
			</div>
			<div className="cart__item__quanity__block">
				<div className="cart__item__price__wrapper">
					<PriceElement price={productData.price} sale={productData.sale} />
				</div>
				<CartQuanityElement productData={productData} />
			</div>
		</div>
	);
};

const CartItemsElement = observer(({ cartProducts }: { cartProducts: MappedProductsResponseCart }) => {
	const productCart = useUserProductCart();

	return (
		<div className="cart__content__wrapper">
			<div className="cart__content__head">
				<div className="cart__page__block__header__wrapper">
					<h2 className="cart__page__block__header">Содержимое</h2>
					<p className="cart__page__block__header__label">
						{productCart.raw_items.length} {declOfNum(productCart.raw_items.length, ['позиция', 'позиций'])}
					</p>
				</div>
				<CartClearButton />
			</div>
			<StandardBreakLine />
			<div className="cart__page__items">
				{cartProducts.data.map((productData) => {
					if (productCart.has(productData.article)) {
						return <CartItemElement productData={productData} key={`cart__item__${productData.article}`} />;
					}
					return null;
				})}
			</div>
		</div>
	);
});

function CartSummaryElement({ cartProducts }: { cartProducts: MappedProductsResponseCart }) {
	return <div className="cart__summary__wrapper"></div>;
}

function CartPageElement() {
	const [cartProducts, setCartProducts] = useState<MappedProductsResponseCart | null>(null);

	useEffect(() => {
		axios({
			method: 'GET',
			url: 'api/products/session/cart',
		}).then((res) => {
			setCartProducts(res.data);
		});
	}, []);

	return (
		<div className="cart__page__container">
			<div className="cart__head__wrapper">
				<ToPreviousPageButton />
				<h1 className="cart__head__header cart__page__block__header">Корзина</h1>
			</div>
			{cartProducts && cartProducts.cart ? (
				<div className="cart__page__content">
					<CartItemsElement cartProducts={cartProducts} />
					<div className="cart__page__summary"></div>
				</div>
			) : null}
		</div>
	);
}

export { CartPageElement };
