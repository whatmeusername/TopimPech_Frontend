import { Metadata } from 'next/types';
import { FavouritesElement } from '../../components/FavouritesElement/FavouritesElement';
import { PAGE_SUB_LABEL, META_PAGE_DESCRIPTION_BASE } from '../layout';

export const metadata: Metadata = {
	title: `Избранные товары ${PAGE_SUB_LABEL}`,
	description: META_PAGE_DESCRIPTION_BASE('Избранные товары'),
};

function FavouritesPageElement() {
	return <FavouritesElement />;
}

export default FavouritesPageElement;
