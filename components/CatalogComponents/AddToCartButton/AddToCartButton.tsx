import './AddToCartButton.scss';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../context/MobxStoreContext/MobxStoreContext';
import Link from 'next/link';
import { ProductData, ProductDataShort } from '../Cards/interface';
import { ReactElement } from 'react';

function AddToCartButton({ product }: { product: ProductData | ProductDataShort }): ReactElement {
	const article = product.article;
	const isAvailable = product.available;
	const userProductCart = useStore('cart');
	const inCart = userProductCart.has(article);

	if (typeof isAvailable === 'boolean' && isAvailable === false) {
		return (
			<div className="product__not__available">
				<p className="product__not__available__text">Товара нет в наличии</p>
			</div>
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
