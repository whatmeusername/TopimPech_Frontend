'use client';

import Link from 'next/link';
import { CategoryData, useCategoriesContext } from '../../context/Categories';
import { HistorySlider } from '../HistorySlider/HistorySlider';
import { RecomendationElement } from '../RecomendationElement/RecomendationElement';
import './HomePageElement.scss';
import { declOfProduct } from '../../utils';
import Slider from '../Shared/Slider';
import { useMobileContext } from '../../context/MobileContext/MobileContext';

import { useGlobalContext } from '../../context/GlobalContext/GlobalContext';
import { DeliveryIcon, InsuranceIcon, PhoneIcon, PriceTagIcon, SettingsIcon } from '../IconsElements';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../const';
import type { SiteInfoData, OurWorksData, ManufacturerData } from './interface';

import { ReactElement } from 'react';
import { ProductTag } from '../CatalogComponents/Cards/interface';
import { ProductSlider } from '../ProductPage/ProductSlider/ProductSlider';
import { Capitalize } from '../../utils/Capitalize';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';

function HomePageElementCategoryItem({ categoryData }: { categoryData: CategoryData }) {
	return (
		<Link className="home__page__categories__item" href={`catalog/${categoryData.slug}`}>
			<div className="home__page__categories__item__info">
				<p className="home__page__categories__item__label">{categoryData.name}</p>
				<p className="home__page__categories__item__count">
					{categoryData.productCount} {declOfProduct(categoryData.productCount)}
				</p>
			</div>
			<div className="home__page__categories__item__image__wrapper">
				<Image
					src={`/api${categoryData.image.path}`}
					className="home__page__categories__item__image"
					onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
					alt={categoryData.name}
					width={210}
					height={210}
					style={{ objectFit: 'contain', maxInlineSize: '100%' }}
				/>
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
	const isMobile = useMobileContext();
	return (
		<div className="home__page__banners__wrapper home__width__limiter">
			<Slider
				SliderSettings={{
					ItemsPerSlide: 1,
					returnToOtherSide: true,
					auto: { timeMS: 5000 },
					disableMobileVersion: true,
					buttons: { disableWhen: 768, enabled: !isMobile },
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
			<div className="home__page__categories__content__wrapper">
				<div className="home__page__categories__content">
					{categories.categories.map((categoryData) => {
						if (categoryData.productCount > 0)
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
		{
			text: 'Имеем более 15 лет опыта в области отопительного обородувания',
		},
		{
			text: 'Работаем без выходных 7 дней в неделю',
		},
		{
			text: 'Оплата картой или переводом',
		},
		{
			text: 'Услуги замера, монтажа и доставки',
		},
		{
			text: `Звоните ${phones[0]} или пишите нам в WhatsApp`,
		},
	];

	return (
		<div className="home__page__about__store">
			<div className="home__page__about__store__content home__width__limiter">
				<div className="home__page__about__header__wrapper">
					<span className="home__page__about__line" />
					<h2 className="home__page__about__header">О нас</h2>
					<span className="home__page__about__line" />
				</div>
				<div className="home__page__about__content">
					<div className="home__page__about__content__wrapper">
						{AboutStoreText.map((data, i) => {
							return (
								<p className="home__page__about__text" key={`home__page__about__text__${i}`}>
									{data.text}
								</p>
							);
						})}
						<div className="home__page__about__links__wrapper">
							<Link href={'/info/contacts'} className="home__page__about__link">
								<PhoneIcon className="home__page__about__link__icon" />
								<p className="home__page__about__link__text">Контакты</p>
							</Link>
							<Link href={'/info/delivery'} className="home__page__about__link">
								<DeliveryIcon className="home__page__about__link__icon" />
								<p className="home__page__about__link__text">Доставка и оплата</p>
							</Link>
						</div>
					</div>
				</div>
				<span className="home__page__about__line" />
			</div>
		</div>
	);
}

function ProductTagSlider({ ProductTagData }: { ProductTagData: Required<ProductTag> }): ReactElement {
	return (
		<div className="home__page__product__tag__slider__wrapper home__width__limiter">
			<div className="home__page__product__tag__slider__header__wrapper">
				<h2 className="home__page__product__tag__slider__header">{Capitalize(ProductTagData.name)}</h2>
			</div>
			<ProductSlider items={ProductTagData.product} URLStartWith={'/api'} />
			<ThinBreakLine />
		</div>
	);
}

function ManufacturesBlock({ ManufacturerData }: { ManufacturerData: ManufacturerData[] }): ReactElement {
	return (
		<div className="home__page__manufacturer__block">
			<div className="home__page__manufacturer__content home__width__limiter">
				<div className="home__page__manufacturer__header__wrapper">
					<h2 className="home__page__manufacturer__header">Производители</h2>
				</div>
				<Slider SliderSettings={{ ItemsPerSlide: 'auto', auto: { timeMS: 5000 }, returnToOtherSide: true }}>
					{ManufacturerData.sort((m) => (m.image ? -1 : 1)).map((manufacturer) => {
						return (
							<Slider.Item className="home__page__manufacturer__item" key={`home__page__manufacturer__item__${manufacturer.slug}`}>
								<Link href={`/catalog/manufacturer/${manufacturer.slug}`} className="home__page__manufacturer__item__content">
									{manufacturer.image ? (
										<div className="home__page__manufacturer__item__image__wrapper">
											<Image
												className="home__page__manufacturer__item__image"
												onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
												src={`/api${manufacturer.image.path}`}
												alt={manufacturer.name}
												width={160}
												height={160}
												style={{ objectFit: 'contain', maxInlineSize: '100%' }}
											/>
										</div>
									) : (
										<p className="home__page__manufacturer__item__label">{Capitalize(manufacturer.name)}</p>
									)}
								</Link>
							</Slider.Item>
						);
					})}
				</Slider>
				<ThinBreakLine />
			</div>
		</div>
	);
}

function AboutMontageElement({ OurWorksData }: { OurWorksData: OurWorksData[] }): ReactElement {
	const MontageBlock = [
		{
			icon: <SettingsIcon className="home__page__montage__item__icon" />,
			header: 'Надежность',
			text: 'Монтажники имеют большой опыт, поэтому вы можете быть уверены в надежности установленных конструкций.',
		},
		{
			icon: <PriceTagIcon className="home__page__montage__item__icon" />,
			header: 'Одна цена',
			text: 'Список необходимых материалов, а также необходимые работы обговариваются заранее и прописываются в смете. Поэтому цены на работы будут неизменны.',
		},
		{
			icon: <InsuranceIcon className="home__page__montage__item__icon" />,
			header: 'Гарантия качества',
			text: 'В течении гарантийного срока неисправности будут устранены силами.',
		},
	];

	return (
		<div className="home__page__montage__wrapper_2">
			<div className="home__page__montage__content home__width__limiter">
				<div className="home__page__montage__wrapper__images">
					{OurWorksData.slice(0, 16).map((img) => {
						return (
							<div className="home__page__montage__item__wrapper" key={`montage__page__work__${img.name}`}>
								<Image
									className="home__page__montage__item"
									onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
									src={`/api${img.path}`}
									alt={`примеры работы ${img.name}`}
									width={220}
									height={220}
									style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
								/>
							</div>
						);
					})}
				</div>
				<div className="home__page__montage__info__wrapper">
					<h2 className="home__page__montage__header">Монтаж и установка банных печей и каминов</h2>
					<div className="home__page__montage__info__items">
						{MontageBlock.map((item, i) => {
							return (
								<div className="home__page__montage__item__wrapper" key={`home__page__montage__item__wrapper__${i}`}>
									<div className="home__page__montage__item__icon__wrapper">{item.icon}</div>
									<div className="home__page__montage__item__info">
										<h3 className="home__page__montage__item__header">{item.header}</h3>
										<p className="home__page__montage__item__text">{item.text}</p>
									</div>
								</div>
							);
						})}
					</div>
					<div className="home__page__montage__link__wrapper">
						<Link href={'/info/montage'} className="home__page__montage__link">
							Подробнее об услуге
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

function HomePageElement({ SiteInfoData }: { SiteInfoData: SiteInfoData }): ReactElement {
	return (
		<div className="home__page__wrapper">
			<BannersSlider />
			<div className="home__page__wrapper__content">
				<AboutStoreElement />
				<HomePageElementCategories />
				<AboutMontageElement OurWorksData={SiteInfoData.OurWorks} />
				{SiteInfoData.ProductsTags?.length > 0 ? <ProductTagSlider ProductTagData={SiteInfoData.ProductsTags[0]} /> : null}
				<ManufacturesBlock ManufacturerData={SiteInfoData.manufacturerData} />
				<RecomendationElement className={'home__width__limiter'} />
				<HistorySlider includeHeader={true} className={'home__width__limiter'} />
			</div>
		</div>
	);
}

export { HomePageElement };
