import { observer } from 'mobx-react-lite';
import { useUserProductCart } from '../../../context/MobxStoreContext/MobxStoreContext';
import { declOfNum } from '../../../utils';
import { StandardBreakLine } from '../../Shared/Lines/StandardBreakLine/StandardBreakLine';
import Link from 'next/link';
import { ReactElement } from 'react';
import { CartItem } from '../../../store';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import { ComparisonButton } from '../../CatalogComponents/ComparisonButton/ComparisonButton';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { TrashBinIcon, MinusIcon, PlusIcon, DeleteIcon } from '../../IconsElements';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';

import './CartItemsElement.scss';

import Image from 'next/image';
import { MappedProductsResponseCart } from '../CartPageElement';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { NO_IMAGE_SRC } from '../../const';

const CartClearButton = observer((): ReactElement => {
	const productCart = useUserProductCart();
	return (
		<button className="cart__clear__button" onClick={productCart.items.length > 0 ? () => productCart.clear() : undefined}>
			<TrashBinIcon className="cart__clear__button__icon" />
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

const CartItemElementDesktop = observer(({ productData, cartItem }: { productData: ProductData; cartItem: CartItem }): ReactElement => {
	const imageSrc = productData.images?.[0]?.path ? `/api${productData.images[0].path}` : NO_IMAGE_SRC;
	return (
		<div className="cart__page__cart__item__desktop">
			<div className="cart__item__main">
				<div className="cart__item__image__wrapper">
					<Image
						className="cart__item__image"
						onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
						src={imageSrc}
						alt={productData.name}
						width={150}
						height={150}
						style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
					/>
				</div>
				<div className="cart__item__main__info">
					<Link href={`/product/${productData.slug}`} className="cart__item__link">
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
					<PriceElement product={productData} quantity={cartItem.count} />
				</div>
				<CartQuanityElement productData={productData} />
			</div>
		</div>
	);
});

const CartItemElementMobile = observer(({ productData, cartItem }: { productData: ProductData; cartItem: CartItem }): ReactElement => {
	const imageSrc = productData.images?.[0]?.path ? `/api${productData.images[0].path}` : NO_IMAGE_SRC;
	return (
		<div className="cart__page__cart__item__mobile">
			<div className="cart__item__main">
				<div className="cart__item__image__wrapper">
					<Image
						className="cart__item__image"
						onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
						src={imageSrc}
						alt={productData.name}
						width={150}
						height={150}
						style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
					/>
				</div>
				<div className="cart__item__main__info">
					<Link href={`/product/${productData.slug}`} className="cart__item__link">
						<p className="cart__item__link__label">{productData.name}</p>
						<PriceElement product={productData} quantity={cartItem.count} />
					</Link>

					<div className="cart__item__options">
						<ComparisonButton productData={productData} withLabel={true} useBaseStyle={true} />
						<CartDeleteItemButton productData={productData} />
					</div>
					<CartQuanityElement productData={productData} />
				</div>
			</div>
		</div>
	);
});

const CartItemsElement = observer(({ cartProducts }: { cartProducts: MappedProductsResponseCart }) => {
	const productCart = useUserProductCart();
	const isMobile = useMobile(768);

	return (
		<div className="cart__content__wrapper">
			<div className="cart__content__head">
				<div className="cart__page__block__header__wrapper">
					<h2 className="cart__page__block__header">Содержимое</h2>
					<p className="cart__page__block__header__label">
						{productCart.items.length} {declOfNum(productCart.items.length, ['позиция', 'позиции', 'позиций'])}
					</p>
				</div>
				<CartClearButton />
			</div>
			<StandardBreakLine />
			<div className="cart__page__items">
				{cartProducts.data.map((productData) => {
					const cartItem = productCart.get(productData.article);
					if (cartItem) {
						return isMobile ? (
							<CartItemElementMobile productData={productData} key={`cart__item__${productData.article}`} cartItem={cartItem} />
						) : (
							<CartItemElementDesktop productData={productData} key={`cart__item__${productData.article}`} cartItem={cartItem} />
						);
					}
					return null;
				})}
			</div>
		</div>
	);
});

export { CartItemsElement };
