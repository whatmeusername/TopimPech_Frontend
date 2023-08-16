import dynamic from 'next/dynamic';
import { META_PAGE_DESCRIPTION_BASE, PROXY_URL } from '../../layout';
import { getData } from '../../../appRouteUtils';
import { Metadata } from 'next';

const PrivacyPolicyElement = dynamic(() => import('../../../components/InfoPages/PrivacyElements/PrivacyPolicyElement'));

async function PrivacyPolicyPage() {
	const privacyPolicyData = await getData(`${PROXY_URL}info/privacypolicy`, { cache: 'no-store' });
	return <PrivacyPolicyElement privacyPolicyData={privacyPolicyData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Политика конфиденциальности',
		description: META_PAGE_DESCRIPTION_BASE,
	};
}

export default PrivacyPolicyPage;
