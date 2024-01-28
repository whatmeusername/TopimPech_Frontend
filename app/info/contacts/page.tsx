import { Metadata } from 'next';
import { ContactsPageElement } from '../../../components/InfoPages/ContactsPageElement/ContactsPageElement';
import { META_PAGE_DESCRIPTION_BASE, OPENGRAPH_BASE, FULL_DOMAIN } from '../../../const/siteinfo.const';

function ContactsPage() {
	return <ContactsPageElement />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Контакты',
		description: META_PAGE_DESCRIPTION_BASE('Контактная информация'),
		openGraph: { ...OPENGRAPH_BASE, title: 'Контактная информация', url: `${FULL_DOMAIN}/info/contacts`, images: ['/api/images/logo/SiteLogo.png'] },
	};
}

export default ContactsPage;
