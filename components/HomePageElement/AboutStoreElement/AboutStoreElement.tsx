import Link from 'next/link';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';
import { PhoneIcon, DeliveryIcon } from '../../IconsElements';
import './AboutStoreElement.scss';

function AboutStoreElement() {
	const phones = useGlobalContext().PhoneNumbersData;

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
			text: `Звоните ${phones[0].format} или пишите нам в WhatsApp`,
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

export { AboutStoreElement };
