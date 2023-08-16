'use client';

import { ReactElement } from 'react';
import './DeliveryPageElement.scss';
import { PrimaryPageHeader } from '../../Shared/PrimaryPageHeader/PrimaryPageHeader';
import { JsonDataMap } from '../../Shared/JsonDataMap/JsonDataMap';
import { YandexMapShopPoint } from '../../Shared/YandexMapShopPoint/YandexMapShopPoint';

function DeliveryPageElement({ deliveryData }: { deliveryData: any }): ReactElement {
	return (
		<div className="delivery__page__wrapper">
			<PrimaryPageHeader header={'Доставка и оплата'} />
			<div className="delivery__page__content__wrapper">
				<div className="delivery__page__content">
					<JsonDataMap data={deliveryData} />
				</div>
				<YandexMapShopPoint />
			</div>
		</div>
	);
}

export default DeliveryPageElement;
