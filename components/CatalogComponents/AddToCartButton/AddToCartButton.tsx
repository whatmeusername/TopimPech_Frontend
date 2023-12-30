import './AddToCartButton.scss';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../context/MobxStoreContext/MobxStoreContext';
import Link from 'next/link';
import { ProductData, ProductDataShort } from '../Cards/interface';
import { ReactElement } from 'react';
import { IS_CART_ENABLED } from '../../../const/settings';

function AddToCartButton({
	product,
	isContactMode,
	showAvailability,
}: {
	product: ProductData | ProductDataShort;
	isContactMode: boolean;
	showAvailability: boolean;
}): ReactElement | null {
	const article = product.article;
	const isAvailable = product.available;
	const userProductCart = useStore('cart');
	const inCart = userProductCart.has(article);

	if ((IS_CART_ENABLED || showAvailability) && typeof isAvailable === 'boolean' && isAvailable === false) {
		return (
			<div className="product__available__status product__not__available">
				<p className="product__available__status__text">Товара нет в наличии</p>
			</div>
		);
	} else if (IS_CART_ENABLED === false && isContactMode === false) {
		if (showAvailability) {
			return (
				<div className="product__available__status product__available">
					<p className="product__available__status__text">В наличии на складе</p>
				</div>
			);
		}
		return null;
	} else if (IS_CART_ENABLED === false && isContactMode === true) {
		return (
			<Link href={'/info/contacts'} className={'product__where__to__buy'}>
				<p className="product__where__to__buy__text">Где купить</p>
			</Link>
		);
	} else if (inCart) {
		return (
			<Link href={'/cart'} className={'product__card__add__to__cart product__card__add__to__cart__active'} title={'В корзине'} aria-pressed={inCart}>
				В корзине
			</Link>
		);
	} else {
		return (
			<button
				className={'product__card__add__to__cart product__card__add__to__cart__inactive'}
				onClick={() => userProductCart.add({ article: article, count: 1, available: isAvailable })}
				title={'В корзину'}
				aria-pressed={inCart}
			>
				В корзину
			</button>
		);
	}
}

export default observer(AddToCartButton);
