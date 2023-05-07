import { CatalogView } from '../components/CatalogContainer/ChangeProductView/interface';
import { useEffect, useState } from 'react';
import { getInitialView } from '../components/CatalogContainer/ChangeProductView/ChangeProductView';
import { useSearchParams } from 'next/navigation';

function useCatalogView(initial?: CatalogView): [CatalogView, (value: CatalogView) => void] {
	const query = useSearchParams();
	const [catalogView, setCatalogView] = useState<CatalogView>(initial ?? CatalogView.ROW);
	useEffect(() => {
		setCatalogView(getInitialView(query));
	}, []);

	return [catalogView, setCatalogView];
}

export { useCatalogView };
