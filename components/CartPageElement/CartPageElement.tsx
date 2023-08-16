'use client';

import axios from 'axios';
import { useState, useEffect, ReactElement, Dispatch, SetStateAction, useRef } from 'react';
import { MappedProductsResponse } from '../CatalogComponents/Cards/interface';
import './CartPageElement.scss';
import { CartItem } from '../../store';
import { useUserProductCart } from '../../context/MobxStoreContext/MobxStoreContext';
import { observer } from 'mobx-react-lite';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { CalculateSale } from '../CatalogComponents/PriceElement.tsx/PriceElement';
import { declOfNum } from '../../utils';
import { CartItemsElement } from './CartItemsElement/CartItemsElement';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import Link from 'next/link';
import { useMobile } from '../../context/MobileContext/MobileContext';
import { LoadingBar } from '../Shared/LoadingBar/LoadingBar';
import { OptionEmptyPage } from '../Shared/OptionEmptyPage/OptionEmptyPage';
import { CheckmarkIcon } from '../IconsElements';
import { OrderElementForm } from './OrderElementForm/OrderElementForm';
import { HistorySlider } from '../HistorySlider/HistorySlider';
import { PrimaryPageHeader } from '../Shared/PrimaryPageHeader/PrimaryPageHeader';

interface MappedProductsResponseCart extends MappedProductsResponse {
	cart: null | CartItem[];
}

const GetTotal = (cartProducts: MappedProductsResponseCart): { count: number; sum: number } => {
	const productCart = useUserProductCart();
	return productCart.items.reduce(
		(acc, item) => {
			const cartItem = cartProducts.data.find((p) => p.article === item.article);
			if (cartItem) {
				acc.count += item.count;
				acc.sum += CalculateSale(cartItem.price, cartItem.sale) * item.count;
			}
			return acc;
		},
		{ count: 0, sum: 0 },
	);
};

const CartSummaryElement = observer(({ cartProducts }: { cartProducts: MappedProductsResponseCart }) => {
	const productCart = useUserProductCart();
	const total = GetTotal(cartProducts);

	return (
		<div className="cart__summary__wrapper">
			<div className="cart__summary__head">
				<h2 className="cart__page__block__header">Общее</h2>
			</div>
			<ThinBreakLine />
			<div className="cart__summary__content__wrapper">
				<div className="cart__summary__content__count">
					{total.count} {declOfNum(total.count, ['товар', 'товара', 'товаров'])}
				</div>
				<div className="cart__summary__content">
					{cartProducts.data.map((productData) => {
						const cartItem = productCart.get(productData.article);
						if (cartItem) {
							const price = CalculateSale(productData.price, productData.sale);
							return (
								<div className="cart__summary__content__item" key={`cart__summary__content__item__${productData.article}`}>
									<p className="cart__summary__content__item__label">{productData.name}</p>
									<p className="cart__summary__content__item__count">
										{price.toLocaleString('ru')} X {cartItem.count} = {(price * cartItem.count).toLocaleString('ru')}
									</p>
								</div>
							);
						}
						return null;
					})}
				</div>
			</div>
			<ThinBreakLine />
			<div className="cart__summary__total__wrapper">
				<p className="cart__summary__total__wrapper__label">Итог:</p>
				<p className="cart__summary__total__wrapper__result">{total.sum.toLocaleString('ru')}</p>
			</div>
		</div>
	);
});

function OrderElement({
	setIsOrderSuccces,
	setIsOrderSended,
	isOrderSended,
}: {
	setIsOrderSuccces: Dispatch<SetStateAction<boolean>>;
	setIsOrderSended: Dispatch<SetStateAction<boolean>>;
	isOrderSended: boolean;
}): ReactElement {
	return (
		<div className="cart__page__order__container">
			<div className="cart__page__order__head">
				<h2 className="cart__page__order__header">Оформление заказа</h2>
			</div>
			<StandardBreakLine />
			<OrderElementForm setIsOrderSuccces={setIsOrderSuccces} setIsOrderSended={setIsOrderSended} isOrderSended={isOrderSended} />
		</div>
	);
}

// interface OrderEmailProp {
// 	name: string;
// 	phone: string;
// 	address: string;
// 	siteUrl: string;
// }

// function EmailElement({ cartProducts, orderProps }: { cartProducts: MappedProductsResponseCart; orderProps: OrderEmailProp }): ReactElement {
// 	const mainContainer = {
// 		backgroundColor: 'rgb(250, 250, 250)',
// 		borderRadius: '8px',
// 		padding: '10px',
// 		margin: '10px 0',
// 	};

// 	const HeaderStyle = {
// 		fontSize: '20px',
// 		color: 'rgb(99, 79, 57)',
// 		fontFamily: 'Arial, Helvetica',
// 	};

// 	const ProductContainer: CSSProperties = {
// 		maxWidth: '300px',
// 		verticalAlign: 'top',
// 		paddingLeft: '12px',
// 		float: 'right',
// 		textAlign: 'right',
// 	};

// 	const PrimaryText = {
// 		color: 'rgb(99, 79, 57)',
// 		fontSize: '16px',
// 		fontWeight: '300',
// 		letterSpacing: '-0.5px',
// 		fontFamily: 'Arial, Helvetica',
// 	};

// 	const SecondaryText = {
// 		fontSize: '14px',
// 		color: 'rgb(150, 150, 150)',
// 		margin: '0px',
// 		fontFamily: 'Arial, Helvetica',
// 	};
// 	const ThirdText = {
// 		fontSize: '16px',
// 		color: 'rgb(240, 115, 15)',
// 		margin: '0',
// 		fontFamily: 'Arial, Helvetica',
// 	};

// 	const PriceText = {
// 		fontSize: '20px',
// 		color: 'rgb(240, 115, 15)',
// 		fontFamily: 'Arial, Helvetica',
// 		margin: '0',
// 	};

// 	const СopyrightText = {
// 		fontSize: '12px',
// 		color: 'rgb(160, 160, 160)',
// 		fontFamily: 'Arial, Helvetica',
// 		margin: '0',
// 	};

// 	let totalPrice = 0;

// 	return (
// 		<Container style={{ maxWidth: '600px', minWidth: '300px' }}>
// 			<ELink href={orderProps.siteUrl} style={{ padding: '0 10px' }}>
// 				<Img src={'/api/images/logo/SiteLogo.png'} height={'50px'} />
// 			</ELink>
// 			<Container style={mainContainer}>
// 				<Heading style={HeaderStyle}>Здраствуйте, {orderProps.name}!</Heading>
// 				<Text style={PrimaryText}>
// 					Вы успешно оформили заказ на сайте{' '}
// 					<ELink href={orderProps.siteUrl} style={ThirdText}>
// 						TopimPech.ru
// 					</ELink>
// 					. В ближайщее время мы свяжемся с вами для уточнение деталей вашего заказа. До этого проверьте ваши данные и заказ:
// 				</Text>
// 				<Text style={SecondaryText}>Контактный номер телефона: {orderProps.phone}</Text>
// 				<Text style={SecondaryText}>Адрес доставки: {orderProps.address}</Text>
// 			</Container>
// 			<Container>
// 				{cartProducts.data.map((product, i) => {
// 					const cartItem = cartProducts.cart?.find((c) => c.article === product.article);

// 					if (!cartItem) return null;
// 					const productPrice = CalculateSale(product.price, product.sale);
// 					totalPrice += productPrice;
// 					return (
// 						<>
// 							<Section key={`order__mail__${product.article}`} style={{ padding: '0 10px' }}>
// 								<Row>
// 									<Column align="center">
// 										<Img src={`/api${product.images[0].path}`} alt={product.name} height={'130px'} style={{ borderRadius: '8px', float: 'left' }} />
// 									</Column>
// 									<Column style={ProductContainer}>
// 										<Text style={PrimaryText}>{product.name}</Text>
// 										<Text style={PriceText}>{(productPrice * cartItem.count).toLocaleString('ru')} руб.</Text>
// 										<Text style={SecondaryText}>количество {cartItem.count}</Text>
// 										<Text style={SecondaryText}>цена за еденицу {productPrice.toLocaleString('ru')} руб.</Text>
// 									</Column>
// 								</Row>
// 							</Section>
// 							{i !== cartProducts.data.length - 1 ? <Hr /> : null}
// 						</>
// 					);
// 				})}
// 			</Container>
// 			<Container style={{ padding: '0 10px' }}>
// 				<Row>
// 					<Column style={{ textAlign: 'left' }}>
// 						<Text style={HeaderStyle}>Общая сумма:</Text>
// 					</Column>
// 					<Column style={{ textAlign: 'right' }}>
// 						<Text style={PriceText}>{totalPrice.toLocaleString('ru')} руб.</Text>
// 					</Column>
// 				</Row>
// 			</Container>
// 			<Container style={mainContainer}>
// 				<Text style={PrimaryText}>
// 					Для отмены данного заказа перейдите по данной{' '}
// 					<ELink href={orderProps.siteUrl} style={ThirdText}>
// 						ссылке
// 					</ELink>
// 				</Text>
// 				<Text style={PrimaryText}>Данное письмо было создано автоматически, отвечать на него не надо.</Text>
// 				<Text style={SecondaryText}>
// 					Данное письмо несет чисто информационный характер, данное письмо не потверждает совершения покупки или иних денежных транзаций
// 				</Text>
// 			</Container>
// 			<Container style={{ textAlign: 'center' }}>
// 				<Text style={СopyrightText}>2019-{new Date().getFullYear()} © - TopimPech.ru товары для бани и вашего дома</Text>
// 				<Text style={СopyrightText}>Печи, камины, тандыры и многое другое</Text>
// 			</Container>
// 		</Container>
// 	);
// }

function OrderSuccessElement({ loaded }: { loaded: boolean }) {
	return (
		<div className="order__page__success__wrapper">
			<StandardBreakLine />
			{loaded ? (
				<div className="order__page__success__content">
					<div className="order__page__success__icon__wrapper">
						<CheckmarkIcon className="order__page__success__icon" />
					</div>
					<div className="order__page__success__content__info">
						<p className="order__page__success__content__header">Заказ успешно оформлен</p>
						<p className="order__page__success__content__text">
							Всю информацию о заказе мы отправили вам на электронную почту указанную вами. В ближайщее время мы свяжемся с вами для подтверждения
							заказа и уточнения деталей
						</p>
						<Link href={'/'} className="order__page__main__page__link">
							Вернуться на главную страницу
						</Link>
					</div>
				</div>
			) : (
				<LoadingBar label={'Создаем ваш заказ'} usePrimaryColor={true} />
			)}
			<StandardBreakLine />
		</div>
	);
}

const CartPageElement = observer(() => {
	const userCart = useUserProductCart();
	const isLoading = useRef<boolean>(false);

	const [cartProducts, setCartProducts] = useState<MappedProductsResponseCart | null>(null);

	const [isOrderSended, setIsOrderSended] = useState<boolean>(false);
	const [isOrderSuccces, setIsOrderSuccces] = useState<boolean>(false);
	const isMobile = useMobile(768);

	useEffect(() => {
		axios({
			method: 'GET',
			url: 'api/products/session/cart',
		}).then((res) => {
			setCartProducts(res.data);
			isLoading.current = true;
		});
	}, []);

	return (
		<>
			{isOrderSended ? (
				<OrderSuccessElement loaded={isOrderSuccces} />
			) : (
				<div className="cart__page__container">
					<PrimaryPageHeader header={'Корзина'} />
					{userCart.isEmpty() ? (
						<OptionEmptyPage page={'cart'} />
					) : !isLoading.current ? (
						<LoadingBar label={'Ищем товары из вашей корзины'} usePrimaryColor={true} />
					) : cartProducts && cartProducts.cart ? (
						<div className="cart__page__content">
							<div className="cart__page__content__main">
								<CartItemsElement cartProducts={cartProducts} />
								{isMobile ? <CartSummaryElement cartProducts={cartProducts} /> : null}
								<OrderElement setIsOrderSuccces={setIsOrderSuccces} setIsOrderSended={setIsOrderSended} isOrderSended={isOrderSended} />
							</div>
							{!isMobile ? <CartSummaryElement cartProducts={cartProducts} /> : null}
						</div>
					) : null}
					<HistorySlider includeHeader={true} />
				</div>
			)}
		</>
	);
});

export type { MappedProductsResponseCart };
export { CartPageElement };
