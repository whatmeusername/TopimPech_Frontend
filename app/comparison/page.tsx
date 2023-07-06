import { cookies } from 'next/headers';
import { PROXY_URL, getData } from '../layout';
import { ComparisonProductsPage } from '../../components/ComparisonProductPage/ComparisonProductsPage';

async function ComparisonPage() {
	return <ComparisonProductsPage />;
}

export default ComparisonPage;
