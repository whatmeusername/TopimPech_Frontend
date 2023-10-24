import { useParams } from 'next/navigation';
import { FilterFetchData } from '../components/CatalogPage/Filter/interface';

function useFilterParam(initialFilters: FilterFetchData): string {
	const { category } = useParams() as { category: string };
	if (category === initialFilters.category) return category;
	else return initialFilters.category;
}

export { useFilterParam };
