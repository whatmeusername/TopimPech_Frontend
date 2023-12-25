import { Metadata } from 'next';
import { FULL_DOMAIN, META_PAGE_DESCRIPTION_BASE, OPENGRAPH_BASE, PROXY_URL } from '../../layout';
import { MontagePageElemenent } from '../../../components/InfoPages/MontagePageElement/MontagePageElement';
import { getData } from '../../../appRouteUtils';
import { SiteInfoData } from '../../../components/HomePageElement/interface';

async function MontagePage() {
	const SiteInfoData: SiteInfoData = await getData(`${PROXY_URL}siteinfo/main/`, { next: { revalidate: 43200 } });
	return <MontagePageElemenent OurWorks={SiteInfoData.OurWorks} />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Монтаж и установка',
		description: META_PAGE_DESCRIPTION_BASE('Информация по монтажу и установке'),
		openGraph: {
			...OPENGRAPH_BASE,
			title: 'Монтаж и установка',
			url: `${FULL_DOMAIN}/info/montage`,
			images: ['/api/images/logo/SiteLogo.png'],
		},
	};
}

export default MontagePage;
