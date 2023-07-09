import { CatalogView } from '../components/CatalogContainer/ChangeProductView/interface';
import { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext/GlobalContext';

function useCatalogView(): [CatalogView, (value: CatalogView) => void] {
	const view = useGlobalContext().view;
	const [catalogView, setCatalogView] = useState<CatalogView>(view ?? CatalogView.ROW);

	return [catalogView, setCatalogView];
}

export { useCatalogView };
