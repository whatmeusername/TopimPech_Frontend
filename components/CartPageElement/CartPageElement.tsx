'use client';

import axios from 'axios';
import { useState, useEffect, ReactElement, Dispatch, SetStateAction, CSSProperties, useRef } from 'react';
import { MappedProductsResponse } from '../CatalogComponents/Cards/interface';
import './CartPageElement.scss';
import { ToPreviousPageButton } from '../Shared/ToPreviousPageButton/ToPreviousPageButton';
import { CartItem } from '../../store';
import { useUserProductCart } from '../../context/MobxStoreContext/MobxStoreContext';
import { observer } from 'mobx-react-lite';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { CalculateSale } from '../CatalogComponents/PriceElement.tsx/PriceElement';
import { declOfNum } from '../../utils';
import { CartItemsElement } from './CartItemsElement/CartItemsElement';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import Link from 'next/link';
import InputMask from 'react-input-mask';
import { Column, Section, Row, Img, Container, Text, Hr, Heading, Link as ELink } from '@react-email/components';
import { useMobile } from '../../context/MobileContext/MobileContext';
import { LoadingBar } from '../Shared/LoadingBar/LoadingBar';

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

function ImportantDot() {
	return <span className="order__element__form__important">*</span>;
}

function UserAggrementElement({
	inputState,
	setInputState,
}: {
	inputState: OrderFormState;
	setInputState: Dispatch<SetStateAction<OrderFormState>>;
}) {
	return (
		<div className="order__element__user__aggrement">
			<div className="order__element__user__aggrement__checkbox">
				<input
					type="checkbox"
					id={'user__aggremenet'}
					className="custom__checkbox"
					defaultChecked={true}
					onChange={(e) => setInputState({ ...inputState, aggrement: e.target.checked })}
				/>
				<label htmlFor={'user__aggremenet'} className="custom__checkbox__label order__element__user__aggrement__label">
					- Я ознакомлен и согласен с{' '}
					<Link href={'/'} className="custom__checkbox__label__link order__element__user__aggrement__link">
						политикой конфиденциальности
					</Link>
				</label>
			</div>
		</div>
	);
}

interface OrderFormStateItem {
	errorLabel: string;
	value: string;
	passed: boolean;
	validate: (value: string) => boolean;
}

interface OrderFormState {
	name: OrderFormStateItem;
	phone: OrderFormStateItem;
	address: OrderFormStateItem;
	mail: OrderFormStateItem;
	aggrement: boolean;
}

const FIELD_CANT_BE_EMPTY = 'Данное поле не должно быть пустым';
const NUMBER_ERROR_LABEL = 'Введите полностью контактный номер';
const MAIL_ERROR_LABEL = 'Введите дейвствительную электронную почту';

const onChange = (
	e: React.ChangeEvent<HTMLInputElement>,
	key: keyof OrderFormState,
	inputState: OrderFormState,
	setInputState: Dispatch<SetStateAction<OrderFormState>>,
) => {
	const state = inputState[key] as OrderFormStateItem;
	const value = e.target.value;
	state.value = value;
	setInputState({ ...inputState, [key]: state });
};

function OrderElementForm(): ReactElement {
	const [inputState, setInputState] = useState<OrderFormState>({
		name: {
			passed: true,
			errorLabel: FIELD_CANT_BE_EMPTY,
			value: '',
			validate: (value: string) => {
				const passed = value.trim() !== '';
				inputState.name.passed = passed;
				return passed;
			},
		},
		phone: {
			passed: true,
			errorLabel: NUMBER_ERROR_LABEL,
			value: '',
			validate: (value: string) => {
				const passed = /\+7\(\d{3}\)\s\d{3}-\d{2}-\d{2}/.test(value);
				inputState.phone.passed = passed;
				return passed;
			},
		},
		address: {
			passed: true,
			errorLabel: FIELD_CANT_BE_EMPTY,
			value: '',
			validate: (value: string) => {
				const passed = value.trim() !== '';
				inputState.address.passed = passed;
				return passed;
			},
		},
		mail: {
			passed: true,
			errorLabel: MAIL_ERROR_LABEL,
			value: '',
			validate: (value: string) => {
				if (value === '') {
					inputState.mail.errorLabel = FIELD_CANT_BE_EMPTY;
					inputState.mail.passed = false;
					return false;
				} else {
					const passed =
						/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
							value,
						);
					inputState.mail.errorLabel = MAIL_ERROR_LABEL;
					inputState.mail.passed = passed;
					return passed;
				}
			},
		},
		aggrement: true,
	});

	function Submit() {
		const namePassed = inputState.name.validate(inputState.name.value);
		const phonePassed = inputState.phone.validate(inputState.phone.value);
		const addressPassed = inputState.address.validate(inputState.address.value);
		const mailPassed = inputState.mail.validate(inputState.mail.value);
		if ([namePassed, phonePassed, addressPassed, mailPassed].every((value) => value) && inputState.aggrement) {
			console.log('Yes');
		} else {
			setInputState({ ...inputState });
		}
	}

	return (
		<div className="order__element__form__wrapper">
			<form
				className="order__element__form"
				onSubmit={(e) => {
					e.preventDefault();
					Submit();
					return false;
				}}
			>
				<div className={`order__element__form__item__wrapper  ${!inputState.name.passed ? 'order__element__form__item__wrapper__wrong' : ''}`}>
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Имя</p>
						<ImportantDot />
					</div>
					<input type="text" className="order__element__form__item__input" onChange={(e) => onChange(e, 'name', inputState, setInputState)} />
					{!inputState.name.passed ? <p className="order__element__form__item__info">{inputState.name.errorLabel}</p> : null}
				</div>
				<div className={`order__element__form__item__wrapper  ${!inputState.phone.passed ? 'order__element__form__item__wrapper__wrong' : ''}`}>
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Телефон</p>
						<ImportantDot />
					</div>
					<InputMask
						mask="+7(999) 999-99-99"
						className="order__element__form__item__input"
						alwaysShowMask={true}
						onChange={(e) => onChange(e, 'name', inputState, setInputState)}
					/>
					{!inputState.phone.passed ? <p className="order__element__form__item__info">{inputState.phone.errorLabel}</p> : null}
				</div>

				<div className={`order__element__form__item__wrapper  ${!inputState.address.passed ? 'order__element__form__item__wrapper__wrong' : ''}`}>
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Адрес</p>
						<ImportantDot />
					</div>
					<input type="text" className="order__element__form__item__input" onChange={(e) => onChange(e, 'name', inputState, setInputState)} />
					{!inputState.address.passed ? <p className="order__element__form__item__info">{inputState.address.errorLabel}</p> : null}
				</div>
				<div className={`order__element__form__item__wrapper  ${!inputState.mail.passed ? 'order__element__form__item__wrapper__wrong' : ''}`}>
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Электронная почта</p>
						<ImportantDot />
					</div>
					<input type="text" className="order__element__form__item__input" onChange={(e) => onChange(e, 'name', inputState, setInputState)} />
					{!inputState.mail.passed ? <p className="order__element__form__item__info">{inputState.mail.errorLabel}</p> : null}
				</div>
				<UserAggrementElement inputState={inputState} setInputState={setInputState} />
				<button className={`order__element__send ${!inputState.aggrement ? 'order__element__send__wrong' : ''}`} type="submit">
					{inputState.aggrement ? 'Оформить заказ' : 'вы должны быть ознакомлены с политикой конфиденциальности '}
				</button>
			</form>
		</div>
	);
}

function OrderElement(): ReactElement {
	return (
		<div className="cart__page__order__container">
			<div className="cart__page__order__head">
				<h2 className="cart__page__order__header">Оформление заказа</h2>
			</div>
			<StandardBreakLine />
			<OrderElementForm />
		</div>
	);
}

interface OrderEmailProp {
	name: string;
	phone: string;
	address: string;
	siteUrl: string;
}

function EmailElement({ cartProducts, orderProps }: { cartProducts: MappedProductsResponseCart; orderProps: OrderEmailProp }): ReactElement {
	const mainContainer = {
		backgroundColor: 'rgb(250, 250, 250)',
		borderRadius: '8px',
		padding: '10px',
		margin: '10px 0',
	};

	const HeaderStyle = {
		fontSize: '20px',
		color: 'rgb(99, 79, 57)',
		fontFamily: 'Arial, Helvetica',
	};

	const ProductContainer: CSSProperties = {
		maxWidth: '300px',
		verticalAlign: 'top',
		paddingLeft: '12px',
		float: 'right',
		textAlign: 'right',
	};

	const PrimaryText = {
		color: 'rgb(99, 79, 57)',
		fontSize: '16px',
		fontWeight: '300',
		letterSpacing: '-0.5px',
		fontFamily: 'Arial, Helvetica',
	};

	const SecondaryText = {
		fontSize: '14px',
		color: 'rgb(150, 150, 150)',
		margin: '0px',
		fontFamily: 'Arial, Helvetica',
	};
	const ThirdText = {
		fontSize: '16px',
		color: 'rgb(240, 115, 15)',
		margin: '0',
		fontFamily: 'Arial, Helvetica',
	};

	const PriceText = {
		fontSize: '20px',
		color: 'rgb(240, 115, 15)',
		fontFamily: 'Arial, Helvetica',
		margin: '0',
	};

	const СopyrightText = {
		fontSize: '12px',
		color: 'rgb(160, 160, 160)',
		fontFamily: 'Arial, Helvetica',
		margin: '0',
	};

	let totalPrice = 0;

	return (
		<Container style={{ maxWidth: '600px', minWidth: '300px' }}>
			<ELink href={orderProps.siteUrl} style={{ padding: '0 10px' }}>
				<Img src={'/api/images/logo/SiteLogo.png'} height={'50px'} />
			</ELink>
			<Container style={mainContainer}>
				<Heading style={HeaderStyle}>Здраствуйте, {orderProps.name}!</Heading>
				<Text style={PrimaryText}>
					Вы успешно оформили заказ на сайте{' '}
					<ELink href={orderProps.siteUrl} style={ThirdText}>
						TopimPech.ru
					</ELink>
					. В ближайщее время мы свяжемся с вами для уточнение деталей вашего заказа. До этого проверьте ваши данные и заказ:
				</Text>
				<Text style={SecondaryText}>Контактный номер телефона: {orderProps.phone}</Text>
				<Text style={SecondaryText}>Адрес доставки: {orderProps.address}</Text>
			</Container>
			<Container>
				{cartProducts.data.map((product, i) => {
					const cartItem = cartProducts.cart?.find((c) => c.article === product.article);

					if (!cartItem) return null;
					const productPrice = CalculateSale(product.price, product.sale);
					totalPrice += productPrice;
					return (
						<>
							<Section key={`order__mail__${product.article}`} style={{ padding: '0 10px' }}>
								<Row>
									<Column align="center">
										<Img src={`api/${product.images[0].path}`} alt={product.name} height={'130px'} style={{ borderRadius: '8px', float: 'left' }} />
									</Column>
									<Column style={ProductContainer}>
										<Text style={PrimaryText}>{product.name}</Text>
										<Text style={PriceText}>{(productPrice * cartItem.count).toLocaleString('ru')} руб.</Text>
										<Text style={SecondaryText}>количество {cartItem.count}</Text>
										<Text style={SecondaryText}>цена за еденицу {productPrice.toLocaleString('ru')} руб.</Text>
									</Column>
								</Row>
							</Section>
							{i !== cartProducts.data.length - 1 ? <Hr /> : null}
						</>
					);
				})}
			</Container>
			<Container style={{ padding: '0 10px' }}>
				<Row>
					<Column style={{ textAlign: 'left' }}>
						<Text style={HeaderStyle}>Общая сумма:</Text>
					</Column>
					<Column style={{ textAlign: 'right' }}>
						<Text style={PriceText}>{totalPrice.toLocaleString('ru')} руб.</Text>
					</Column>
				</Row>
			</Container>
			<Container style={mainContainer}>
				<Text style={PrimaryText}>
					Для отмены данного заказа перейдите по данной{' '}
					<ELink href={orderProps.siteUrl} style={ThirdText}>
						ссылке
					</ELink>
				</Text>
				<Text style={PrimaryText}>Данное письмо было создано автоматически, отвечать на него не надо.</Text>
				<Text style={SecondaryText}>
					Данное письмо несет чисто информационный характер, данное письмо не потверждает совершения покупки или иних денежных транзаций
				</Text>
			</Container>
			<Container style={{ textAlign: 'center' }}>
				<Text style={СopyrightText}>2019-{new Date().getFullYear()} © - TopimPech.ru товары для бани и вашего дома</Text>
				<Text style={СopyrightText}>Печи, камины, тандыры и многое другое</Text>
			</Container>
		</Container>
	);
}

function CartPageElement() {
	const userCart = useUserProductCart();
	const isLoading = useRef<boolean>(false);
	const [cartProducts, setCartProducts] = useState<MappedProductsResponseCart | null>(null);
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
		<div className="cart__page__container">
			<div className="cart__head__wrapper">
				<ToPreviousPageButton />
				<h1 className="cart__head__header cart__page__block__header">Корзина</h1>
			</div>
			{userCart.isEmpty() ? (
				<LoadingBar label={'Ищем товары из вашей корзины'} usePrimaryColor={true} />
			) : !isLoading.current ? (
				<LoadingBar label={'Ищем товары из вашей корзины'} usePrimaryColor={true} />
			) : cartProducts && cartProducts.cart ? (
				<div className="cart__page__content">
					<div className="cart__page__content__main">
						<CartItemsElement cartProducts={cartProducts} />
						{isMobile ? <CartSummaryElement cartProducts={cartProducts} /> : null}
						<OrderElement />
					</div>
					{!isMobile ? <CartSummaryElement cartProducts={cartProducts} /> : null}
				</div>
			) : null}
		</div>
	);
}

export type { MappedProductsResponseCart };
export { CartPageElement };
