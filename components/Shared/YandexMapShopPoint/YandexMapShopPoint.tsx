import './YandexMapShopPoint.scss';

function YandexMapShopPoint() {
	return (
		<div className="shop__map__widget__wrapper">
			<div className="shop__map">
				<iframe
					src="https://yandex.ru/map-widget/v1/?um=constructor%3A3e78024ccf09d34f546be98b346d84165e626dabe0b2398e33db4fcbd59fd007&amp;source=constructor"
					height={'500px'}
					className="shop__map__widget"
					frameBorder="0"
				/>
				<p className="shop__map__widget__label">
					Наш магазин находится по адресу: 1-я Вокзальная улица, 11, микрорайон Барыбино, Домодедово, Московская область, 142060
				</p>
			</div>
		</div>
	);
}

export { YandexMapShopPoint };
