'use client';

import { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import { FavouritesItem, FavouritesProducts, UserProductCart } from '../../store';
import get from 'axios';

enableStaticRendering(typeof window === 'undefined');

const rootStore = {
	cart: new UserProductCart(),
	favourites: new FavouritesProducts(),
};
type RootStore = typeof rootStore;

const RootStoreContext = createContext<RootStore>(null!);

function useStore<T extends keyof RootStore>(store: T): (typeof rootStore)[T] {
	return useContext(RootStoreContext)[store];
}

const useUserProductCart = (): UserProductCart => {
	return useContext(RootStoreContext).cart;
};

const useFavouritesProducts = (): FavouritesProducts => {
	return useContext(RootStoreContext).favourites;
};

const useComparinsonProducts = (): FavouritesProducts => {
	return useContext(RootStoreContext).favourites;
};

interface UserSession {
	UID: string;
	UserAgent: string;
	cart: { id: string; count: number }[];
	favourites: FavouritesItem[];
	comparison: number[];
	created: Date;
	expires: Date;
}

function updateRootStoreData(session?: UserSession): void {
	if (session) {
		rootStore.cart.hydrate(session.cart);
		rootStore.favourites.hydrate(session.favourites);
	}
}

function MobxStoreSessionBasedContext({ children, session }: { children: ReactElement | ReactElement[] | null; session?: UserSession }) {
	const [sessionData, setSessionData] = useState<UserSession | undefined>(session);

	useEffect(() => {
		if (!sessionData) {
			get('api/session/get').then((response) => {
				setSessionData(response.data);
			});
		}
	}, [sessionData]);

	if (session) updateRootStoreData(session);
	return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export { MobxStoreSessionBasedContext, useStore, useUserProductCart, useFavouritesProducts, useComparinsonProducts };
export type { UserSession };
