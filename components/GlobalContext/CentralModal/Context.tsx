import { createContext, useContext, SetStateAction, Dispatch } from 'react';

interface CentralModalContext {
	cc: JSX.Element | null;
	sc: Dispatch<SetStateAction<JSX.Element>> | null;
	oc: false;
	os: Dispatch<SetStateAction<boolean>> | null;
}
const CategoryContextData = createContext<CentralModalContext>(null!);

const CentralModalContext = ({ children }: { children: JSX.Element }) => {
	return (
		<CategoryContextData.Provider value={{ cc: null, sc: null, oc: false, os: null }}>
			{children}
		</CategoryContextData.Provider>
	);
};

const useCentralModalContext = (): CentralModalContext => {
	return useContext(CategoryContextData);
};

export { useCentralModalContext, CentralModalContext };
