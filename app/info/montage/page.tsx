import { Metadata } from 'next';
import { FULL_DOMAIN, META_PAGE_DESCRIPTION_BASE, OPENGRAPH_BASE } from '../../layout';
import { MontagePageElemenent } from '../../../components/InfoPages/MontagePageElement/MontagePageElement';

function MontagePage() {
	return <MontagePageElemenent />;
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
