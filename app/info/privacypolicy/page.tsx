import dynamic from 'next/dynamic';
import { getData } from '../../../appRouteUtils';
import { Metadata } from 'next';
import { PROXY_URL, META_PAGE_DESCRIPTION_BASE, OPENGRAPH_BASE, FULL_DOMAIN } from '../../../const/siteinfo.const';

const PrivacyPolicyElement = dynamic(() => import('../../../components/InfoPages/PrivacyElements/PrivacyPolicyElement'));

async function PrivacyPolicyPage() {
	const privacyPolicyData = await getData(`${PROXY_URL}info/privacypolicy`, { cache: 'no-store' });
	return <PrivacyPolicyElement privacyPolicyData={privacyPolicyData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Политика конфиденциальности',
		description: META_PAGE_DESCRIPTION_BASE('Политика конфиденциальности данных'),
		openGraph: {
			...OPENGRAPH_BASE,
			title: 'Политика конфиденциальности',
			url: `${FULL_DOMAIN}/info/privacypolicy`,
			images: ['/api/images/logo/SiteLogo.png'],
		},
	};
}

export default PrivacyPolicyPage;
