import './AddToCartButton.scss';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../context/MobxStoreContext/MobxStoreContext';
import Link from 'next/link';

function AddToCartButton({ article }: { article: string }): JSX.Element {
	const userProductCart = useStore('cart');
	const inCart = userProductCart.has(article);

	if (inCart) {
		return (
			<Link href={'/cart'} className={'product__card__add__to__cart product__card__add__to__cart__active'} title={'В корзине'} aria-pressed={inCart}>
				В корзине
			</Link>
		);
	} else {
		return (
			<button
				className={'product__card__add__to__cart product__card__add__to__cart__inactive'}
				onClick={() => userProductCart.add({ article: article, count: 1 })}
				title={'В корзину'}
				aria-pressed={inCart}
			>
				В корзину
			</button>
		);
	}
}

export default observer(AddToCartButton);
