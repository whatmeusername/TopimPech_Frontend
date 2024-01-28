const PROXY_URL = process.env.PROXY_URL ?? 'http://localhost:8000';

const SITE_URL = process.env.SITE_URL ?? PROXY_URL;
const SITE_URL_SLICED = SITE_URL.slice(0, SITE_URL.length);

const BASE_PHONE = '+7 (916) 926-96-66';

const PhoneNumbersData = [
	{ flat: '79169269666', format: '+7 (916) 926-96-66', isWhatsapp: true },
	{ flat: '79150182774', format: '+7 (915) 018-27-74', isWhatsapp: false },
];

const DOMAIN_NAME = 'topimpech.ru';
const DOMAIN_NAME_LOCALE = 'ТопимПечь.ру';
const FULL_DOMAIN = `https://${DOMAIN_NAME}`;

const PRODUCT_PAGE_SUB_LABEL = `купить в интернет-магазине в Московской области товаров для бани и дома ${DOMAIN_NAME_LOCALE}`;
const PAGE_SUB_LABEL = `- интернет-магазин товаров для бани ${DOMAIN_NAME_LOCALE}`;
const META_PAGE_DESCRIPTION = (prodcutName: string) =>
	`${prodcutName} - купить по доступной цене в интернет-магазине печей, каминов, котлов, дымоходов и других товаров для вашей бани и дома ${DOMAIN_NAME_LOCALE}. ${prodcutName} - характеристика, фото, описание, похожие товары. Заказ товаров и консультация по телефону - ${BASE_PHONE}. Услуги замера и монтажа`;
const META_PAGE_DESCRIPTION_BASE = (prefix?: string) =>
	`${
		prefix ? prefix + '.' : ''
	} Интернет магазин ${DOMAIN_NAME_LOCALE} печей, каминов, котлов, дымоходов и других товаров для вашей бани и дома. Доставка по московской области. Услуги замера и монтажа. Заказ товаров и консультация по телефону - ${BASE_PHONE}`;

const PAGE_NOT_FOUND = 'Ошибка 404. Страница не была найдена.';

const OPENGRAPH_BASE = {
	locale: 'ru_RU',
	siteName: DOMAIN_NAME,
	type: 'website',
};

export {
	PROXY_URL,
	PRODUCT_PAGE_SUB_LABEL,
	PAGE_NOT_FOUND,
	META_PAGE_DESCRIPTION,
	BASE_PHONE,
	DOMAIN_NAME,
	SITE_URL,
	SITE_URL_SLICED,
	OPENGRAPH_BASE,
	FULL_DOMAIN,
	PAGE_SUB_LABEL,
	META_PAGE_DESCRIPTION_BASE,
	PhoneNumbersData,
	DOMAIN_NAME_LOCALE,
};
