'use client';

import { ReactElement, createContext, useContext } from 'react';
import { CatalogView } from '../../components/CatalogContainer/ChangeProductView/interface';
import { MappedProductsResponse } from '../../components/CatalogComponents/Cards/interface';

interface GlobalContextData {
	productCount: number;
	view: CatalogView;
	basePhoneNumber: string[];
	recomendation: MappedProductsResponse<true>;
	baseAddress: string;
}

const GlobalContextData = createContext<GlobalContextData>(null!);

function GlobalContext({
	children,
	productCount,
	view,
	basePhoneNumber,
	recomendation,
	baseAddress,
}: {
	children: ReactElement | ReactElement[];
	productCount: number;
	view: CatalogView;
	basePhoneNumber: string[];
	recomendation: MappedProductsResponse<true>;
	baseAddress: string;
}): ReactElement {
	return (
		<GlobalContextData.Provider
			value={{ basePhoneNumber: basePhoneNumber, productCount: productCount, view: view, recomendation: recomendation, baseAddress: baseAddress }}
		>
			{children}
		</GlobalContextData.Provider>
	);
}

function useGlobalContext(): GlobalContextData {
	return useContext(GlobalContextData);
}

export { GlobalContext, GlobalContextData, useGlobalContext };
