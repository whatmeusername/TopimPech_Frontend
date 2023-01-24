import { useState } from 'react';

import './AddToCartButton.scss';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../../../store';
import { addItem } from '../../../../../store/cart.slice';

function AddToCartButton({ itemId }: { itemId: number }): JSX.Element {
	const dispatch = useDispatch();
	const cartData = useSelector((state: RootState) => state.cart).raw_items;
	const [inCart, setInCart] = useState<boolean>(cartData.find((i) => i.id === itemId) !== undefined);

	if (!inCart) {
		return (
			<button
				className="product__card__add__to__cart product__card__add__to__cart__inactive"
				onClick={() => {
					setInCart(true);
					dispatch(addItem({ id: itemId, count: 1 }));
				}}
			>
				В корзину
			</button>
		);
	} else {
		return <button className="product__card__add__to__cart product__card__add__to__cart__active">В корзине</button>;
	}
}

export default AddToCartButton;
