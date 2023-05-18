'use client';

import { ReactElement, createContext, useContext } from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import { UserProductCart } from '../../store';

enableStaticRendering(typeof window === 'undefined');

let rootStore = {
	cart: new UserProductCart(),
};
type RootStore = typeof rootStore;

const RootStoreContext = createContext<RootStore>(null!);

const useStore = (store: keyof RootStore) => {
	return useContext(RootStoreContext)[store];
};

interface UserSession {
	UID: string;
	UserAgent: string;
	cart: { id: string; count: number }[];
	favourites: number[];
	comparison: number[];
	created: Date;
	expires: Date;
}

function MobxStoreSessionBasedContext({ children, session }: { children: ReactElement | ReactElement[] | null; session: UserSession }) {
	return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export { MobxStoreSessionBasedContext, useStore };
export type { UserSession };
