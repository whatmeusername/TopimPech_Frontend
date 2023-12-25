import { fetchMainInfo } from '../appRouteUtils';
import { HomePageElement } from '../components/HomePageElement/HomePageElement';

async function MainPage() {
	const SiteInfoData = await fetchMainInfo();
	return <HomePageElement SiteInfoData={SiteInfoData} />;
}

export default MainPage;
