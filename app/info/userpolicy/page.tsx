import dynamic from 'next/dynamic';
import { PROXY_URL, getData } from '../../layout';

const UserPolicyElement = dynamic(() => import('../../../components/InfoPages/PrivacyElements/UserPolicyElement'));

async function UserPolicyPage() {
	const userPolicyData = await getData(`${PROXY_URL}info/userpolicy`, { cache: 'no-store' });
	return <UserPolicyElement userPolicyData={userPolicyData} />;
}

export default UserPolicyPage;
