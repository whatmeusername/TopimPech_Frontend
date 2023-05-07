'use client';

import { ReactElement, createContext, useContext } from 'react';

const PagePropsContext = createContext<any>(null!);
const usePagePropsContext = () => {
	return useContext(PagePropsContext);
};

const PagePropsContextProvider = ({ children, value }: { children: ReactElement | ReactElement[]; value: any }) => {
	return <PagePropsContext.Provider value={value}>{children}</PagePropsContext.Provider>;
};

export { PagePropsContext, usePagePropsContext, PagePropsContextProvider };
