import React, { ReactElement } from 'react';
import './footer.scss';
import { useCategoriesContext } from '../../../context/Categories';
import Link from 'next/link';
import Image from 'next/image';

import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';
import { SiteLogo } from '../../IconsElements';

const COPYRIGHTS_LABEL =
	'Представленная информация на сайте носит чисто информационный смысл, материалы и цены, размещенные на сайте, не являются публичной офертой. Подробную информацию уточняйте у продавца.';

function CatalogBlock(): ReactElement {
	const categories = useCategoriesContext();
	return (
		<div className="footer__content__block">
			<p className="footer__content__block__header">Каталог</p>
			<div className="footer__content__block__column">
				{categories.categories.map((category) => {
					return (
						<Link href={`/catalog/${category.slug}`} key={`footer__catalog__${category.slug}`} className="footer__content__block__column__item">
							{category.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}

function OrderBlock(): ReactElement {
	const OrderDataLinks = [
		{
			link: '/info/delivery',
			slug: 'delivery',
			name: 'Доставка и оплата',
		},
		{
			link: '/info/contacts',
			slug: 'contacts',
			name: 'Контакты',
		},
		{
			link: '/info/order',
			slug: 'order',
			name: 'Как заказать',
		},
		{
			link: '/info/policy',
			slug: 'policy',
			name: 'Политика конфиденциальности',
		},
	];

	return (
		<div className="footer__content__block">
			<p className="footer__content__block__header">Информация</p>
			<div className="footer__content__block__column">
				{OrderDataLinks.map((data) => {
					return (
						<Link href={data.link} key={`footer__catalog__${data.slug}`} className="footer__content__block__column__item">
							{data.name}
						</Link>
					);
				})}
			</div>
		</div>
	);
}

function FooterLogo(): ReactElement {
	return (
		<div className="footer__logo__wrapper">
			<SiteLogo className="footer__logo" />
		</div>
	);
}

function ContactsColumn(): ReactElement {
	const PhoneNumber = useGlobalContext();
	return (
		<div className="footer__contacts__wrapper">
			<div className="footer__contacts__content__wrapper footer__contacts__phone__wrapper">
				<p className="footer__contacts__data__header">Контактный номер</p>
				{PhoneNumber.basePhoneNumber.map((phone, i) => {
					return (
						<p className="footer__contacts__data" key={`contacts__phone__${i}`}>
							{phone}
						</p>
					);
				})}
			</div>
			<div className="footer__contacts__content__wrapper">
				<p className="footer__contacts__data__header">Электронная почта</p>
				<p className="footer__contacts__data">info@topimpech.ru</p>
			</div>
			<div className="footer__contacts__content__wrapper">
				<p className="footer__contacts__data">Рабочее время: c 9.00 - 18.00</p>
			</div>
		</div>
	);
}

function Footer(): ReactElement {
	return (
		<footer className="footer__wrapper">
			<div className="footer__content__wrapper">
				<div className="footer__content__main">
					<CatalogBlock />
					<OrderBlock />
				</div>
				<div className="footer__content__contacts">
					<p className="footer__content__block__header">Контактная информация</p>
					<FooterLogo />
					<ContactsColumn />
				</div>
			</div>
			<ThinBreakLine />
			<div className="footer__copyrights__wrapper">
				<div className="footer__copyrights">
					<p className="footer__copyrights__watermark">2019-{new Date().getFullYear()} © - TopimPech.ru товары для бани и вашего дома</p>
					<p className="footer__copyrights__content">{COPYRIGHTS_LABEL}</p>
				</div>
			</div>
		</footer>
	);
}

export { Footer };
