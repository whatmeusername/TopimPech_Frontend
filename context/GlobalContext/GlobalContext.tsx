'use client';

import { ReactElement, createContext, useContext } from 'react';
import { CatalogView } from '../../components/CatalogContainer/ChangeProductView/interface';
import { MappedProductsResponse } from '../../components/CatalogComponents/Cards/interface';

interface GlobalContextData {
	productCount: number;
	view: CatalogView;
	basePhoneNumber: string[];
	recomendation: MappedProductsResponse<true>;
}

const GlobalContextData = createContext<GlobalContextData>(null!);

function GlobalContext({
	children,
	productCount,
	view,
	basePhoneNumber,
	recomendation,
}: {
	children: ReactElement | ReactElement[];
	productCount: number;
	view: CatalogView;
	basePhoneNumber: string[];
	recomendation: MappedProductsResponse<true>;
}): ReactElement {
	return (
		<GlobalContextData.Provider value={{ basePhoneNumber: basePhoneNumber, productCount: productCount, view: view, recomendation: recomendation }}>
			{children}
		</GlobalContextData.Provider>
	);
}

function useGlobalContext(): GlobalContextData {
	return useContext(GlobalContextData);
}

export { GlobalContext, GlobalContextData, useGlobalContext };
