'use client';

import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';
import { EmailIcon, PhoneIcon, PinIcon } from '../../IconsElements';
import { PrimaryPageHeader } from '../../Shared/PrimaryPageHeader/PrimaryPageHeader';
import { YandexMapShopPoint } from '../../Shared/YandexMapShopPoint/YandexMapShopPoint';
import './ContactsPageElement.scss';

function ContactsPageElement() {
	const basePhoneNumber = useGlobalContext().basePhoneNumber;

	const ContactsData = [
		{
			icon: <PhoneIcon className="contacts__data__icon" />,
			header: 'Контактный номер',
			text: basePhoneNumber,
		},
		{
			icon: <EmailIcon className="contacts__data__icon" />,
			header: 'Электронная почта',
			text: 'info@topimpech.ru',
		},
		{
			icon: <PinIcon className="contacts__data__icon" />,
			header: 'Адрес магазина',
			text: '1-я Вокзальная улица, 11, микрорайон Барыбино, Домодедово, Московская область, 142060',
		},
	];

	return (
		<div className="contacts__page__wrapper">
			<PrimaryPageHeader header={'Контакты'} />
			<div className="contacts__page__content">
				<div className="contacts__page__info">
					{ContactsData.map((item, i) => {
						return (
							<div className="contacts__page__info__item" key={`contact__info__item__${i}`}>
								<div className="contacts__page__info__item__icon__wrapper">{item.icon}</div>
								<div className="contacts__page__info__item__content">
									<h2 className="contacts__page__info__item__header">{item.header}</h2>
									{Array.isArray(item.text) ? (
										<>
											{item.text.map((t, i) => (
												<p className="contacts__page__info__item__text" key={`contacts__page__info__item__text__${i}`}>
													{t}
												</p>
											))}
										</>
									) : (
										<p className="contacts__page__info__item__text">{item.text}</p>
									)}
								</div>
							</div>
						);
					})}
				</div>
				<YandexMapShopPoint />
			</div>
		</div>
	);
}

export { ContactsPageElement };
