import { ComparisonProductsPage } from '../../components/ComparisonProductPage/ComparisonProductsPage';
import { Metadata } from 'next/types';
import { PAGE_SUB_LABEL, META_PAGE_DESCRIPTION_BASE } from '../layout';

export const metadata: Metadata = {
	title: `Сравнение товаров ${PAGE_SUB_LABEL}`,
	description: META_PAGE_DESCRIPTION_BASE('Сравнение товаров'),
};

async function ComparisonPage() {
	return <ComparisonProductsPage />;
}

export default ComparisonPage;
