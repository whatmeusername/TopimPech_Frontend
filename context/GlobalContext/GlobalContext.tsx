'use client';

import { ReactElement, createContext, useContext } from 'react';
import { CatalogView } from '../../components/CatalogContainer/ChangeProductView/interface';
import { MappedProductsResponse } from '../../components/CatalogComponents/Cards/interface';

interface GlobalContextData {
	productCount: number;
	view: CatalogView;
	PhoneNumbersData: { format: string; flat: string; isWhatsapp: boolean }[];
	recomendation: MappedProductsResponse<true>;
	baseAddress: string;
}

const GlobalContextData = createContext<GlobalContextData>(null!);

function GlobalContext({
	children,
	productCount,
	view,
	PhoneNumbersData,
	recomendation,
	baseAddress,
}: {
	children: ReactElement | ReactElement[];
	productCount: number;
	view: CatalogView;
	PhoneNumbersData: { format: string; flat: string; isWhatsapp: boolean }[];
	recomendation: MappedProductsResponse<true>;
	baseAddress: string;
}): ReactElement {
	return (
		<GlobalContextData.Provider
			value={{
				PhoneNumbersData: PhoneNumbersData,
				productCount: productCount,
				view: view,
				recomendation: recomendation,
				baseAddress: baseAddress,
			}}
		>
			{children}
		</GlobalContextData.Provider>
	);
}

function useGlobalContext(): GlobalContextData {
	return useContext(GlobalContextData);
}

export { GlobalContext, GlobalContextData, useGlobalContext };
