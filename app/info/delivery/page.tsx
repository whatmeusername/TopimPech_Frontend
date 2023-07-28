import dynamic from 'next/dynamic';
import { PROXY_URL, getData } from '../../layout';

const DeliveryPageElement = dynamic(() => import('../../../components/InfoPages/DeliveryPageElement/DeliveryPageElement'));

async function DeliveryPage() {
	const deliveryData = await getData(`${PROXY_URL}info/delivery`, { cache: 'no-store' });
	return <DeliveryPageElement deliveryData={deliveryData} />;
}

export default DeliveryPage;
