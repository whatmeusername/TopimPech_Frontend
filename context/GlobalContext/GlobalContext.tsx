'use client';

import { ReactElement, createContext, useContext } from 'react';
import { CatalogView } from '../../components/CatalogContainer/ChangeProductView/interface';
import { MappedProductsResponse } from '../../components/CatalogComponents/Cards/interface';
import { SiteInfoData } from '../../components/HomePageElement/interface';

interface GlobalContextData {
	productCount: number;
	view: CatalogView;
	PhoneNumbersData: { format: string; flat: string; isWhatsapp: boolean }[];
	recomendation: MappedProductsResponse<true>;
	baseAddress: string;
	SiteInfo: SiteInfoData;
}

const GlobalContextData = createContext<GlobalContextData>(null!);

function GlobalContext({
	children,
	productCount,
	view,
	PhoneNumbersData,
	recomendation,
	baseAddress,
	SiteInfo,
}: {
	children: ReactElement | ReactElement[];
	productCount: number;
	view: CatalogView;
	PhoneNumbersData: { format: string; flat: string; isWhatsapp: boolean }[];
	recomendation: MappedProductsResponse<true>;
	baseAddress: string;
	SiteInfo: SiteInfoData;
}): ReactElement {
	return (
		<GlobalContextData.Provider
			value={{
				PhoneNumbersData: PhoneNumbersData,
				productCount: productCount,
				view: view,
				recomendation: recomendation,
				baseAddress: baseAddress,
				SiteInfo: SiteInfo,
			}}
		>
			{children}
		</GlobalContextData.Provider>
	);
}

function useGlobalContext(): GlobalContextData {
	return useContext(GlobalContextData);
}

function useSiteInfoContext(): SiteInfoData {
	return useContext(GlobalContextData).SiteInfo;
}

export { GlobalContext, GlobalContextData, useGlobalContext, useSiteInfoContext };
