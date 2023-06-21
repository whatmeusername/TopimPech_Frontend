'use client';

import { ReactElement, createContext, useContext } from 'react';

interface GlobalContextData {
	productCount: number;
}

const GlobalContextData = createContext<GlobalContextData>(null!);

function GlobalContext({ children, productCount }: { children: ReactElement | ReactElement[]; productCount: number }): ReactElement {
	return <GlobalContextData.Provider value={{ productCount: productCount }}>{children}</GlobalContextData.Provider>;
}

function useGlobalContext(): GlobalContextData {
	return useContext(GlobalContextData);
}

export { GlobalContext, GlobalContextData, useGlobalContext };
