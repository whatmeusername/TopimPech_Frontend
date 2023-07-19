import { Metadata } from 'next';
import { NotFoundPage } from '../../../components/Shared/NotFoundPage/NotFoundPage';
import { PAGE_NOT_FOUND, META_PAGE_DESCRIPTION_BASE } from '../../layout';

export const metadata: Metadata = {
	title: PAGE_NOT_FOUND,
	description: META_PAGE_DESCRIPTION_BASE,
};

export default function NotFound() {
	return <NotFoundPage label="По вашему поисковому запросу не было найдено ни одного результата" icon={'search'} />;
}
