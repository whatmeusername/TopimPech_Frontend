import { userProductCart } from '../../../store/cart';
import { HydrationComponent } from '../../ProductPage/ProductPage';
import './AddToCartButton.scss';

import { observer } from 'mobx-react-lite';

function AddToCartButton({ itemId }: { itemId: number }): JSX.Element {
	const inCart = userProductCart.has(itemId);

	return (
		<HydrationComponent>
			{!inCart ? (
				<button
					className="product__card__add__to__cart product__card__add__to__cart__inactive"
					onClick={() => {
						userProductCart.addItem({ id: itemId, count: 1 });
					}}
				>
					В корзину
				</button>
			) : (
				<button className="product__card__add__to__cart product__card__add__to__cart__active">В корзине</button>
			)}
		</HydrationComponent>
	);
}

export default observer(AddToCartButton);
