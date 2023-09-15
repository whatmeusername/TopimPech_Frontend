'use client';

import Link from 'next/link';
import { CategoryData, useCategoriesContext } from '../../context/Categories';
import { HistorySlider } from '../HistorySlider/HistorySlider';
import { RecomendationElement } from '../RecomendationElement/RecomendationElement';
import './HomePageElement.scss';
import { declOfProduct } from '../../utils';
import Slider from '../Shared/Slider';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import { useMobile } from '../../context/MobileContext/MobileContext';

import { useGlobalContext } from '../../context/GlobalContext/GlobalContext';
import { InsuranceIcon, PriceTagIcon, SettingsIcon } from '../IconsElements';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../const';

function HomePageElementCategoryItem({ categoryData }: { categoryData: CategoryData }) {
	return (
		<Link className="home__page__categories__item" href={`catalog/${categoryData.slug}`}>
			<div className="home__page__categories__item__image__wrapper">
				<Image
					src={`/api${categoryData.image?.path}`}
					className="home__page__categories__item__image"
					onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
					alt={categoryData.name}
					width={180}
					height={180}
					style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
				/>
			</div>
			<div className="home__page__categories__item__info">
				<p className="home__page__categories__item__label">{categoryData.name}</p>
				<p className="home__page__categories__item__count">
					{categoryData.productCount} {declOfProduct(categoryData.productCount)}
				</p>
			</div>
		</Link>
	);
}

const banners = [
	{
		desktop: '/api/images/banners/TopimPechBanner01Desktop.png',
		mobile: '/api/images/banners/TopimPechBanner01Mobile.png',
		url: '/catalog/drovyannye-pechi-vezuvij-legenda-russkij-par',
	},
	{
		desktop: '/api/images/banners/TopimPechBanner02Desktop.png',
		mobile: '/api/images/banners/TopimPechBanner02Mobile.png',
		url: '/catalog/pechi-kaminy-everest',
	},
	{
		desktop: '/api/images/banners/TopimPechBanner03Desktop.png',
		mobile: '/api/images/banners/TopimPechBanner03Mobile.png',
		url: '/catalog/drovyannye-pechi-aston',
	},
];

function BannersSlider() {
	const isMobile = useMobile(720, true);
	return (
		<div className="home__page__banners__wrapper home__width__limiter">
			<Slider
				SliderSettings={{
					ItemsPerSlide: 1,
					returnToOtherSide: true,
					auto: { timeMS: 5000 },
					disableMobileVersion: true,
					buttons: { disableWhen: 768 },
				}}
			>
				{banners.map((banner, i) => {
					return (
						<Slider.Item key={`home__page__banner__${i}`} className="home__page__banner__item">
							<div>
								<Link href={banner.url} className="home__page__banner__link">
									<Image
										src={isMobile ? banner.mobile : banner.desktop}
										className="home__page__banner__image"
										onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
										alt={banner.url}
										width={isMobile ? 720 : 1440}
										height={isMobile ? 420 : 400}
										style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
									/>
								</Link>
							</div>
						</Slider.Item>
					);
				})}
			</Slider>
		</div>
	);
}

function HomePageElementCategories() {
	const categories = useCategoriesContext();

	return (
		<div className="home__page__categories__wrapper home__width__limiter">
			<div className="home__page__categories__header__wrapper">
				<h2 className="home__page__categories__header">Категории товаров</h2>
				<StandardBreakLine />
			</div>
			<div className="home__page__categories__content__wrapper">
				<div className="home__page__categories__content">
					{categories.categories.map((categoryData) => {
						return <HomePageElementCategoryItem key={`home__page__category__item__${categoryData.slug}`} categoryData={categoryData} />;
					})}
				</div>
			</div>
		</div>
	);
}

function AboutStoreElement() {
	const phones = useGlobalContext().basePhoneNumber;

	const AboutStoreText = [
		'Имеем более 15 лет опыта в области отопительного обородувания',
		'Работаем без выходных 7 дней в неделю',
		'Оплата картой или переводом',
		'Услуги замера, монтажа и доставки',
		`Звоните ${phones[0]} или пишите нам в WhatsApp`,
	];

	return (
		<div className="home__page__about__store">
			<div className="home__page__about__store__content home__width__limiter">
				<div className="home__page__about__header__wrapper">
					<span className="home__page__about__line" />
					<h2 className="home__page__about__header">О нас</h2>
					<span className="home__page__about__line" />
				</div>
				<div className="home__page__about__text__wrapper">
					{AboutStoreText.map((text, i) => {
						return (
							<p className="home__page__about__text" key={`home__page__about__text__${i}`}>
								{text}
							</p>
						);
					})}
				</div>
				<div className="home__page__about__links__wrapper">
					<Link href={'/info/contacts'} className="home__page__about__link">
						Контакты
					</Link>
					<Link href={'/info/delivery'} className="home__page__about__link">
						Доставка и оплата
					</Link>
				</div>
				<span className="home__page__about__line" />
			</div>
		</div>
	);
}

function AboutMontageElement() {
	const MontageBlock = [
		{
			icon: <SettingsIcon className="home__page__montage__item__icon" />,
			header: 'Надежность',
			text: 'Монтажники имеют большой опыт, поэтому вы можете быть уверены в надежности установленных конструкций.',
		},
		{
			icon: <PriceTagIcon className="home__page__montage__item__icon" />,
			header: 'Одна цена',
			text: 'Список необходимых материалов, а также необходимые работы обговариваются заранее и прописываются в смете. Поэтому цены на работы будут не измены.',
		},
		{
			icon: <InsuranceIcon className="home__page__montage__item__icon" />,
			header: 'Гарантия качества',
			text: 'В течении гарантийного срока неисправности будут устранены силами.',
		},
	];

	return (
		<div className="home__page__montage__wrapper">
			<div className="home__page__montage__content home__width__limiter">
				<div className="home__page__montage__header__wrapper">
					<span className="home__page__montage__line" />
					<h2 className="home__page__montage__header">Монтаж и установка банных печей и каминов</h2>
					<span className="home__page__montage__line" />
				</div>
				<div className="home__page__montage__info__wrapper">
					{MontageBlock.map((item, i) => {
						return (
							<div className="home__page__montage__item__wrapper" key={`home__page__montage__item__wrapper__${i}`}>
								<div className="home__page__montage__item__icon__wrapper">{item.icon}</div>
								<div className="home__page__montage__item__header__wrapper">
									<h3 className="home__page__montage__item__header">{item.header}</h3>
								</div>
								<p className="home__page__montage__item__text">{item.text}</p>
							</div>
						);
					})}
				</div>
				<div className="home__page__montage__link__wrapper">
					<Link href={'/info/montage'} className="home__page__montage__link">
						Подробнее об услуге
					</Link>
				</div>
				<span className="home__page__montage__line" />
			</div>
		</div>
	);
}

function HomePageElement() {
	return (
		<div className="home__page__wrapper">
			<BannersSlider />
			<div className="home__page__wrapper__content">
				<AboutStoreElement />
				<HomePageElementCategories />
				<AboutMontageElement />
				<RecomendationElement className={'home__width__limiter'} />
				<HistorySlider includeHeader={true} className={'home__width__limiter'} />
			</div>
		</div>
	);
}

export { HomePageElement };
