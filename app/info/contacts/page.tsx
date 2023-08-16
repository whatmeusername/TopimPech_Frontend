import { Metadata } from 'next';
import { ContactsPageElement } from '../../../components/InfoPages/ContactsPageElement/ContactsPageElement';
import { META_PAGE_DESCRIPTION_BASE } from '../../layout';

function ContactsPage() {
	return <ContactsPageElement />;
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Контакты',
		description: META_PAGE_DESCRIPTION_BASE,
	};
}

export default ContactsPage;
