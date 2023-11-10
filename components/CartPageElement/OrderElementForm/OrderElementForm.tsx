import axios from 'axios';
import { Dispatch, ReactElement, SetStateAction, useRef, useState } from 'react';
import { useUserProductCart } from '../../../context/MobxStoreContext/MobxStoreContext';
import Link from 'next/link';
import InputMask from 'react-input-mask';
import './OrderElementForm.scss';
import { MappedProductsResponseCart } from '../CartPageElement';

interface OrderFormStateItem {
	errorLabel: string;
	value: string;
	passed: boolean;
}

interface OrderFormValidators {
	name: (value: string) => boolean;
	phone: (value: string) => boolean;
	address: (value: string) => boolean;
	mail: (value: string) => boolean;
}

interface OrderFormState {
	name: OrderFormStateItem;
	phone: OrderFormStateItem;
	address: OrderFormStateItem;
	mail: OrderFormStateItem;
	aggrement: boolean;
	message: string;
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
	setInputState({ ...inputState, [key]: { ...state } });
};

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
					<Link href={'/info/privacypolicy'} className="custom__checkbox__label__link order__element__user__aggrement__link" prefetch={false}>
						политикой конфиденциальности
					</Link>
				</label>
			</div>
		</div>
	);
}

function OrderElementSendOrderButton({ inputState, cartProducts }: { inputState: OrderFormState; cartProducts: MappedProductsResponseCart }) {
	const hasNotAvailable = cartProducts.data.some((p) => p.available === false);
	const label = hasNotAvailable
		? 'В вашей корзине есть товары, которые отсуствуют на складе'
		: inputState.aggrement
		? 'Оформить заказ'
		: 'вы должны быть ознакомлены с политикой конфиденциальности';
	const isDisabled = !inputState.aggrement || hasNotAvailable ? true : false;
	return (
		<button
			className={`order__element__send ${!inputState.aggrement || hasNotAvailable ? 'order__element__send__wrong' : ''}`}
			type="submit"
			disabled={isDisabled}
		>
			{label}
		</button>
	);
}
function OrderElementForm({
	setIsOrderSuccces,
	setIsOrderSended,
	isOrderSended,
	cartProducts,
}: {
	setIsOrderSuccces: Dispatch<SetStateAction<boolean>>;
	setIsOrderSended: Dispatch<SetStateAction<boolean>>;
	isOrderSended: boolean;
	cartProducts: MappedProductsResponseCart;
}): ReactElement {
	const userCart = useUserProductCart();

	const validators = useRef<OrderFormValidators>({
		name: (value: string) => {
			const passed = value.trim() !== '';
			setInputState((prev) => {
				prev.name.passed = passed;
				return { ...prev, name: { ...prev.name } };
			});
			return passed;
		},
		phone: (value: string) => {
			const passed = /\+7\(\d{3}\)\s\d{3}-\d{2}-\d{2}/.test(value);
			setInputState((prev) => {
				prev.phone.passed = passed;
				return { ...prev, phone: { ...prev.phone } };
			});
			return passed;
		},
		address: (value: string) => {
			const passed = value.trim() !== '';
			setInputState((prev) => {
				prev.address.passed = passed;
				return { ...prev, address: { ...prev.address } };
			});
			return passed;
		},
		mail: (value: string) => {
			if (value === '') {
				inputState.mail.errorLabel = FIELD_CANT_BE_EMPTY;
				setInputState((prev) => {
					prev.mail.passed = false;
					return { ...prev, mail: { ...prev.mail } };
				});
				return false;
			} else {
				const passed =
					/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
						value,
					);

				setInputState((prev) => {
					prev.mail.errorLabel = MAIL_ERROR_LABEL;
					prev.mail.passed = passed;
					return { ...prev, mail: { ...prev.mail } };
				});
				return passed;
			}
		},
	});
	const [inputState, setInputState] = useState<OrderFormState>({
		name: {
			passed: true,
			errorLabel: FIELD_CANT_BE_EMPTY,
			value: '',
		},
		phone: {
			passed: true,
			errorLabel: NUMBER_ERROR_LABEL,
			value: '',
		},
		address: {
			passed: true,
			errorLabel: FIELD_CANT_BE_EMPTY,
			value: '',
		},
		mail: {
			passed: true,
			errorLabel: MAIL_ERROR_LABEL,
			value: '',
		},
		aggrement: true,
		message: '',
	});

	function Submit() {
		const namePassed = validators.current.name(inputState.name.value);
		const phonePassed = validators.current.phone(inputState.phone.value);
		const addressPassed = validators.current.address(inputState.address.value);
		const mailPassed = validators.current.mail(inputState.mail.value);

		if ([namePassed, phonePassed, addressPassed, mailPassed].every((value) => value) && inputState.aggrement && !isOrderSended) {
			setIsOrderSended(true);
			axios({
				method: 'POST',
				url: '/api/order/create',
				data: {
					name: inputState.name.value,
					mail: inputState.mail.value,
					phone: inputState.phone.value,
					address: inputState.address.value,
					message: inputState.message,
				},
			}).then(() => {
				userCart.clear();
				setIsOrderSuccces(true);
			});
		}
	}

	return (
		<div className="order__element__form__wrapper">
			<form
				className="order__element__form"
				onSubmit={
					isOrderSended
						? undefined
						: (e) => {
								e.preventDefault();
								const hasNotAvailable = cartProducts.data.some((p) => p.available === false);
								if (inputState.aggrement && hasNotAvailable === false) Submit();
								return false;
						  }
				}
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
						onChange={(e) => onChange(e, 'phone', inputState, setInputState)}
					/>
					{!inputState.phone.passed ? <p className="order__element__form__item__info">{inputState.phone.errorLabel}</p> : null}
				</div>

				<div className={`order__element__form__item__wrapper  ${!inputState.address.passed ? 'order__element__form__item__wrapper__wrong' : ''}`}>
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Адрес доставки</p>
						<ImportantDot />
					</div>
					<input type="text" className="order__element__form__item__input" onChange={(e) => onChange(e, 'address', inputState, setInputState)} />
					{!inputState.address.passed ? <p className="order__element__form__item__info">{inputState.address.errorLabel}</p> : null}
				</div>
				<div className={`order__element__form__item__wrapper  ${!inputState.mail.passed ? 'order__element__form__item__wrapper__wrong' : ''}`}>
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Электронная почта</p>
						<ImportantDot />
					</div>
					<input type="text" className="order__element__form__item__input" onChange={(e) => onChange(e, 'mail', inputState, setInputState)} />
					{!inputState.mail.passed ? <p className="order__element__form__item__info">{inputState.mail.errorLabel}</p> : null}
				</div>
				<div className="order__element__form__item__wrapper order__element__form__item__wrapper__message">
					<div className="order__element__form__item__label__wrappper">
						<p className="order__element__form__item__label">Комментарий к заказу</p>
					</div>
					<textarea className="order__element__form__item__input" onChange={(e) => setInputState({ ...inputState, message: e.target.value })} />
				</div>
				<UserAggrementElement inputState={inputState} setInputState={setInputState} />
				<p className="order__element__info">
					После оформления заказа вы получите всю информацию о заказе на электронную почту указанную вами, мы свяжемся с вами для подтверждения заказа
					и уточнения деталей
				</p>
				<OrderElementSendOrderButton inputState={inputState} cartProducts={cartProducts} />
			</form>
		</div>
	);
}

export { OrderElementForm };
