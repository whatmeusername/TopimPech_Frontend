import './ContactUs.scss';
import PechIconImage from '../../../public/other/PechIconImage.svg';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';
import { SearchIcon } from '../../IconsElements';

function ContactUs() {
	const globalContext = useGlobalContext();
	return (
		<div className="contact__us__wrapper">
			<div className="contact__us__icon__wrapper">
				<SearchIcon className="contact__us__icon" />
				<PechIconImage className="contact__us__icon__inner" />
			</div>
			<div className="contact__us__content">
				<div className="contact__us__content__info">
					<h2 className="contact__us__content__header">Не можете выбрать товар? Позвоните нам!</h2>
					<p className="contact__us__description">
						Поможем подобрать печь под вашу баню, выбрать для нее надежный дымоход, сориентируем по монтажу, а также доставке. 15+ Лет занимаемся
						баними и печами
					</p>
				</div>
				<div className="contact__us__phones__wrapper">
					<p className="contact__us__phones__header">Контактные номера</p>
					<div className="contact__us__phones">
						{globalContext.basePhoneNumber.map((phone, i) => {
							return (
								<p className="contact__us__phones__item" key={`contact__us__phones__item_${i}`}>
									{phone}
								</p>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export { ContactUs };
