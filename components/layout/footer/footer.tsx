import React, { ReactElement } from 'react';
import './footer.scss';
import { useCategoriesContext } from '../../../context/Categories';
import Link from 'next/link';

import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';
import { PhoneIcon, SiteLogo } from '../../IconsElements';
import { WhatsappLink } from '../../Shared/WhatsappLink/WhatsappLink';

const COPYRIGHTS_LABEL =
	'Представленная информация на сайте носит чисто информационный смысл, материалы и цены, размещенные на сайте, не являются публичной офертой. Подробную информацию уточняйте у продавца.';

function CatalogBlock(): ReactElement {
	const categories = useCategoriesContext();
	return (
		<div className="footer__content__block">
			<p className="footer__content__block__header">Каталог</p>
			<ul className="footer__content__block__column">
				{categories.categories.map((category) => {
					if (category.productCount === 0) return null;
					return (
						<li className="footer__content__block__column__item" key={`footer__catalog__${category.slug}`}>
							<Link href={`/catalog/${category.slug}`}>{category.name}</Link>
						</li>
					);
				})}
			</ul>
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
			link: '/info/montage',
			slug: 'montage',
			name: 'Монтаж и установка',
		},
		{
			link: '/info/manufacturer',
			slug: 'manufacturer',
			name: 'Производители',
		},
		{
			link: '/info/contacts',
			slug: 'contacts',
			name: 'Контакты',
		},
		{
			link: '/info/userpolicy',
			slug: 'userpolicy',
			name: 'Пользовательское соглашение',
		},
		{
			link: '/info/privacypolicy',
			slug: 'privacypolicy',
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
	const GlobalContext = useGlobalContext();
	return (
		<div className="footer__contacts__wrapper" itemScope itemType="http://schema.org/Organization">
			<div className="footer__contacts__content__wrapper footer__contacts__phone__wrapper">
				<p className="footer__contacts__data__header">Контактные номера</p>
				{GlobalContext.PhoneNumbersData.map((phone, i) => {
					return (
						<div className="footer__contacts__data__wrapper" key={`contacts__phone__${i}`}>
							<PhoneIcon className="footer__contacts__data__phone__icon" />
							<p className="footer__contacts__data__phone" itemProp="telephone">
								{phone.format}
							</p>
						</div>
					);
				})}
			</div>
			<div className="footer__contacts__content__wrapper footer__contacts__phone__wrapper">
				<p className="footer__contacts__data__header">Whatsapp</p>
				{GlobalContext.PhoneNumbersData.filter((p) => p.isWhatsapp).map((phone, i) => {
					return (
						<div className="footer__contacts__data__wrapper" key={`contacts__phone__${i}`}>
							<WhatsappLink phoneNumber={phone.flat} />
							<p className="footer__contacts__data__phone" itemProp="telephone">
								{phone.format}
							</p>
						</div>
					);
				})}
			</div>
			<div className="footer__contacts__content__wrapper">
				<p className="footer__contacts__data__header">Электронная почта</p>
				<p className="footer__contacts__data" itemProp="email">
					info@topimpech.ru
				</p>
			</div>
			<div className="footer__contacts__content__wrapper">
				<p className="footer__contacts__data">Рабочее время: c 10.00 - 18.00</p>
			</div>
			<meta itemProp="name" content="ТопимПечь" />
			<meta itemProp="address" content={GlobalContext.baseAddress} />
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
					<p className="footer__copyrights__watermark">© {new Date().getFullYear()} - TopimPech.ru товары для бани и вашего дома</p>
					<p className="footer__copyrights__content">{COPYRIGHTS_LABEL}</p>
				</div>
			</div>
		</footer>
	);
}

export { Footer };
