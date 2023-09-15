import { notFound } from 'next/navigation';
import { getData } from '../../../../../appRouteUtils';
import { META_PAGE_DESCRIPTION_BASE, PROXY_URL, ServerSideURLProps } from '../../../../layout';
import { Metadata } from 'next';
import { OrderCancelElement } from '../../../../../components/OrderCancelElement/OrderCancelElement';

async function OrderCancelPage({ params }: ServerSideURLProps) {
	const orderData = await getData(`${PROXY_URL}order/get/${params.token}`, { cache: 'no-cache' });
	if (!orderData) {
		notFound();
	}
	return <OrderCancelElement orderData={orderData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Отмена заказа',
		description: META_PAGE_DESCRIPTION_BASE(),
	};
}

export default OrderCancelPage;
