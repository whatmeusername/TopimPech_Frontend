import { useRouter } from 'next/router';
import { CatalogView } from '../components/CatalogContainer/ChangeProductView/interface';
import { useEffect, useState } from 'react';
import { getInitialView } from '../components/CatalogContainer/ChangeProductView/ChangeProductView';

function useCatalogView(initial?: CatalogView): [CatalogView, (value: CatalogView) => void] {
	const router = useRouter();
	const [catalogView, setCatalogView] = useState<CatalogView>(initial ?? CatalogView.ROW);
	useEffect(() => {
		setCatalogView(getInitialView(router));
	}, []);

	return [catalogView, setCatalogView];
}

export { useCatalogView };
