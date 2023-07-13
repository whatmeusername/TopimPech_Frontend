import Link from 'next/link';
import { CartFilledIcon, ComparisonIcon, HeartNotFilledIcon } from '../../IconsElements';
import './OptionEmptyPage.scss';

function OptionEmptyPage({ page }: { page: 'cart' | 'favourite' | 'comparison' }) {
	let icon;
	let label;
	let header;
	let rotated = false;
	if (page === 'cart') {
		rotated = true;
		header = 'Ваша корзина пуста';
		icon = <CartFilledIcon className="option__empty__page__icon" />;
		label = <p className="option__empty__page__main__label">Загляните в каталог, что бы найти нужный товар или найдите нужное в поиске</p>;
	} else if (page === 'comparison') {
		header = 'Сравнивать нечего';
		icon = <ComparisonIcon className="option__empty__page__icon" />;
		label = (
			<p className="option__empty__page__main__label">
				Добавляйте товары, которые вы бы хотели сравнить с помощью <ComparisonIcon className="option__empty__page__main__label__icon" />
			</p>
		);
	} else if (page === 'favourite') {
		header = 'В избранном пусто';
		icon = <HeartNotFilledIcon className="option__empty__page__icon" />;
		label = (
			<p className="option__empty__page__main__label">
				Добавляйте понравившийся вам товары в избранное с помощью <HeartNotFilledIcon className="option__empty__page__main__label__icon" />
			</p>
		);
	}
	return (
		<div className="option__empty__page__wrapper">
			<div className="option__empty__page">
				<div className={`option__empty__page__icon__wrapper ${rotated ? 'option__empty__page__icon__rotated' : ''}`}>{icon}</div>
				<div className="option__empty__page__main">
					<h2 className="option__empty__page__main__header">{header}</h2>
					{label}
					<Link href={'/'} className="option__empty__page__main__button">
						вернуться на главную страницу
					</Link>
				</div>
			</div>
		</div>
	);
}

export { OptionEmptyPage };
