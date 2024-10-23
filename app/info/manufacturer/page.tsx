export const dynamic = 'force-dynamic';

import { getData } from '../../../appRouteUtils';
import { SiteInfoData } from '../../../components/HomePageElement/interface';
import { ManufacturerPageElement } from '../../../components/ManufacturerPageElement/ManufacturerPageElement';
import { PROXY_URL } from '../../../const/siteinfo.const';

async function ManufacturerPage() {
	const SiteInfoData: SiteInfoData = await getData(`${PROXY_URL}siteinfo/main/`, { next: { revalidate: 43200 } });
	return <ManufacturerPageElement ManufacturerData={SiteInfoData.manufacturerData} />;
}

export default ManufacturerPage;
