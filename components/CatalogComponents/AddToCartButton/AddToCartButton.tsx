import { useEffect, useState } from 'react';
import { userProductCart } from '../../../store/cart';

import './AddToCartButton.scss';

import { observer } from 'mobx-react-lite';

function AddToCartButton({ itemId }: { itemId: number }): JSX.Element {
	const inCart = userProductCart.has(itemId);

	return (
		<button
			suppressHydrationWarning
			className={`product__card__add__to__cart ${inCart ? 'product__card__add__to__cart__active' : 'product__card__add__to__cart__inactive'}`}
			onClick={inCart ? undefined : () => userProductCart.addItem({ id: itemId, count: 1 })}
		>
			{inCart ? 'В корзине' : 'В корзину'}
		</button>
	);
}

export default observer(AddToCartButton);
