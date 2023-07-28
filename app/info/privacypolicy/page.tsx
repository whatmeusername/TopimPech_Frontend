import dynamic from 'next/dynamic';
import { PROXY_URL, getData } from '../../layout';

const PrivacyPolicyElement = dynamic(() => import('../../../components/InfoPages/PrivacyElements/PrivacyPolicyElement'));

async function PrivacyPolicyPage() {
	const privacyPolicyData = await getData(`${PROXY_URL}info/privacypolicy`, { cache: 'no-store' });
	return <PrivacyPolicyElement privacyPolicyData={privacyPolicyData} />;
}

export default PrivacyPolicyPage;
