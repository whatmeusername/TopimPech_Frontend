import { usePathname, useParams } from 'next/navigation';
import { FilterFetchData } from '../components/CatalogPage/Filter/interface';

function useFilterPathname(initialFilters: FilterFetchData): string {
	const path = usePathname();
	const { category } = useParams() as { category: string };
	if (category === initialFilters.category) return path;
	else return `/catalog/${initialFilters.category}`;
}

export { useFilterPathname };
