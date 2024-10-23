export const dynamic = 'force-dynamic';

import { default as DynamicLoad } from 'next/dynamic';
import { getData } from '../../../appRouteUtils';
import { Metadata } from 'next';
import { PROXY_URL, OPENGRAPH_BASE, FULL_DOMAIN } from '../../../const/siteinfo.const';

const DeliveryPageElement = DynamicLoad(() => import('../../../components/InfoPages/DeliveryPageElement/DeliveryPageElement'));

async function DeliveryPage() {
	const deliveryData = await getData(`${PROXY_URL}info/delivery`, { cache: 'no-store' });
	return <DeliveryPageElement deliveryData={deliveryData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Доставка и оплата',
		description: 'Информация по доставке и оплате',
		openGraph: {
			...OPENGRAPH_BASE,
			title: 'Информация по доставке и оплате',
			url: `${FULL_DOMAIN}/info/delivery`,
			images: ['/api/images/logo/SiteLogo.png'],
		},
	};
}

export default DeliveryPage;
