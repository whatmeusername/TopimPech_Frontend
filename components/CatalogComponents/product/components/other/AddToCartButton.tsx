import './AddToCartButton.scss';

import { userProductCart } from '../../../../../store/index';
import { observer } from 'mobx-react-lite';

function AddToCartButton({ itemId }: { itemId: number }): JSX.Element {
	const inCart = userProductCart.has(itemId);

	if (!inCart) {
		return (
			<button
				className="product__card__add__to__cart product__card__add__to__cart__inactive"
				onClick={() => {
					userProductCart.addItem({ id: itemId, count: 1 });
				}}
			>
				В корзину
			</button>
		);
	} else {
		return <button className="product__card__add__to__cart product__card__add__to__cart__active">В корзине</button>;
	}
}

export default observer(AddToCartButton);
