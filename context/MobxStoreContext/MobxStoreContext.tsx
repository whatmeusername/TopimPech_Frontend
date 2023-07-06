'use client';

import { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import { FavouritesItem, FavouritesProducts, UserProductCart } from '../../store';
import get from 'axios';
import { ComparisonStore } from '../../store/comparison';

enableStaticRendering(typeof window === 'undefined');

const rootStore = {
	cart: new UserProductCart(),
	favourites: new FavouritesProducts(),
	comparison: new ComparisonStore(),
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

const useComparinsonProducts = (): ComparisonStore => {
	return useContext(RootStoreContext).comparison;
};

interface UserSession {
	UID: string;
	UserAgent: string;
	cart: { id: string; count: number }[];
	favourites: FavouritesItem[];
	comparison: string[];
	created: Date;
	expires: Date;
}

function updateRootStoreData(session?: UserSession): void {
	if (session) {
		rootStore.cart.hydrate(session.cart);
		rootStore.favourites.hydrate(session.favourites);
		rootStore.comparison.hydrate(session.comparison);
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
