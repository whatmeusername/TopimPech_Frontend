'use client';

import { ReactElement, createContext, useContext } from 'react';
import { CatalogView } from '../../components/CatalogContainer/ChangeProductView/interface';

interface GlobalContextData {
	productCount: number;
	view: CatalogView;
	basePhoneNumber: string;
}

const GlobalContextData = createContext<GlobalContextData>(null!);

function GlobalContext({
	children,
	productCount,
	view,
	basePhoneNumber,
}: {
	children: ReactElement | ReactElement[];
	productCount: number;
	view: CatalogView;
	basePhoneNumber: string;
}): ReactElement {
	return (
		<GlobalContextData.Provider value={{ basePhoneNumber: basePhoneNumber, productCount: productCount, view: view }}>
			{children}
		</GlobalContextData.Provider>
	);
}

function useGlobalContext(): GlobalContextData {
	return useContext(GlobalContextData);
}

export { GlobalContext, GlobalContextData, useGlobalContext };
