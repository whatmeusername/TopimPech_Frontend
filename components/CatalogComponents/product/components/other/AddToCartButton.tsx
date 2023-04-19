import './AddToCartButton.scss';

import { userProductCart } from '../../../../../store/index';
import { observer } from 'mobx-react-lite';
import { HydrationComponent } from '../../../../ProductPage/ProductPage';

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
