import dynamic from 'next/dynamic';
import { FULL_DOMAIN, META_PAGE_DESCRIPTION_BASE, OPENGRAPH_BASE, PROXY_URL } from '../../layout';
import { getData } from '../../../appRouteUtils';
import { Metadata } from 'next';

const UserPolicyElement = dynamic(() => import('../../../components/InfoPages/PrivacyElements/UserPolicyElement'));

async function UserPolicyPage() {
	const userPolicyData = await getData(`${PROXY_URL}info/userpolicy`, { cache: 'no-store' });
	return <UserPolicyElement userPolicyData={userPolicyData} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Пользовательское соглашение',
		description: META_PAGE_DESCRIPTION_BASE('Пользовательское соглашение'),
		openGraph: {
			...OPENGRAPH_BASE,
			title: 'Пользовательское соглашение',
			url: `${FULL_DOMAIN}/info/userpolicy`,
			images: ['/api/images/logo/SiteLogo.png'],
		},
	};
}
export default UserPolicyPage;
