import { DeliveryPageElement } from '../../../components/DeliveryPageElement/DeliveryPageElement';
import { PROXY_URL, getData } from '../../layout';

async function DeliveryPage() {
	const deliveryData = await getData(`${PROXY_URL}info/delivery`, { cache: 'no-store' });
	return <DeliveryPageElement deliveryData={deliveryData} />;
}

export default DeliveryPage;
