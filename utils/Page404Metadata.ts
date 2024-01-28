import { Metadata } from 'next';
import { META_PAGE_DESCRIPTION, PAGE_NOT_FOUND, DOMAIN_NAME } from '../const/siteinfo.const';

function Page404Metadata() {
	const description = META_PAGE_DESCRIPTION('товары для бани и дома');
	const result: Metadata = {
		title: PAGE_NOT_FOUND,
		description: META_PAGE_DESCRIPTION('товары для бани и дома'),
		openGraph: {
			title: description,
			description: description,
			url: DOMAIN_NAME,
		},
	};
	return result;
}

export { Page404Metadata };
