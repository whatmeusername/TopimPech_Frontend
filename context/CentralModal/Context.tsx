import { createContext, useContext, MutableRefObject } from 'react';

interface CentralModalContext {
	ref: MutableRefObject<HTMLDivElement>;
}
const CategoryContextData = createContext<CentralModalContext>(null!);

const CentralModalContext = ({ children }: { children: JSX.Element }) => {
	return <CategoryContextData.Provider value={{ ref: null! }}>{children}</CategoryContextData.Provider>;
};

const useCentralModalContext = (): CentralModalContext => {
	return useContext(CategoryContextData);
};

export { useCentralModalContext, CentralModalContext };
