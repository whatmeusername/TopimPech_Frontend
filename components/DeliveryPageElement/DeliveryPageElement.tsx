'use client';

import { Fragment, ReactElement } from 'react';
import './DeliveryPageElement.scss';
import { PrimaryPageHeader } from '../Shared/PrimaryPageHeader/PrimaryPageHeader';

function YandexMapShopPoint() {
	return (
		<div className="delivery__page__map__wrapper">
			<div className="delivery__page__map">
				<iframe
					src="https://yandex.ru/map-widget/v1/?um=constructor%3A3e78024ccf09d34f546be98b346d84165e626dabe0b2398e33db4fcbd59fd007&amp;source=constructor"
					height={'500px'}
					className="delivery__page__map__widget"
					frameBorder="0"
				/>
				<p className="delivery__page__map__label">
					Наш магазин находится по адресу: 1-я Вокзальная улица, 11, микрорайон Барыбино, Домодедово, Московская область, 142060
				</p>
			</div>
		</div>
	);
}

function DeliveryPageElement({ deliveryData }: { deliveryData: any }): ReactElement {
	return (
		<div className="delivery__page__wrapper">
			<PrimaryPageHeader header={'Доставка и оплата'} />
			<div className="delivery__page__content__wrapper">
				<div className="delivery__page__content">
					{deliveryData.map((block: any, i: number) => {
						return (
							<Fragment key={`delivery__page__element__${i}`}>
								<h2>{block.header}</h2>
								{block.list ? (
									<ul>
										{block.list.map((item: string, i: number) => {
											return <li key={`delivery__list__item__${i}`}>{item}</li>;
										})}
									</ul>
								) : (
									<p>{block.text}</p>
								)}
							</Fragment>
						);
					})}
				</div>
				<YandexMapShopPoint />
			</div>
		</div>
	);
}

export { DeliveryPageElement };
