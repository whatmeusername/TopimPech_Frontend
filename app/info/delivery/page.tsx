import dynamic from 'next/dynamic';
import { META_PAGE_DESCRIPTION_BASE, PROXY_URL } from '../../layout';
import { getData } from '../../../appRouteUtils';
import { Metadata } from 'next';

const DeliveryPageElement = dynamic(() => import('../../../components/InfoPages/DeliveryPageElement/DeliveryPageElement'));

async function DeliveryPage() {
	const deliveryData = await getData(`${PROXY_URL}info/delivery`, { cache: 'no-store' });
	return <DeliveryPageElement deliveryData={deliveryData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Доставка и оплата',
		description: META_PAGE_DESCRIPTION_BASE,
	};
}

export default DeliveryPage;
