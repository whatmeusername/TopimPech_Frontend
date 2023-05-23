import './AddToCartButton.scss';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../context/MobxStoreContext/MobxStoreContext';

function AddToCartButton({ article }: { article: string }): JSX.Element {
	const userProductCart = useStore('cart');
	const inCart = userProductCart.has(article);

	return (
		<button
			className={`product__card__add__to__cart ${inCart ? 'product__card__add__to__cart__active' : 'product__card__add__to__cart__inactive'}`}
			onClick={inCart ? undefined : () => userProductCart.addItem({ id: article, count: 1 })}
			title={inCart ? 'В корзине' : 'В корзину'}
			aria-pressed={inCart}
		>
			{inCart ? 'В корзине' : 'В корзину'}
		</button>
	);
}

export default observer(AddToCartButton);
