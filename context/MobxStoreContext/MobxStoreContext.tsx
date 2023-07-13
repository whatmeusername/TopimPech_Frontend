'use client';

import { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { enableStaticRendering } from 'mobx-react-lite';
import { FavouritesProducts, ProductHistory, UserProductCart } from '../../store';
import get from 'axios';
import { ComparisonStore } from '../../store/comparison';
import { ProductDataShort } from '../../components/CatalogComponents/Cards/interface';

enableStaticRendering(typeof window === 'undefined');

const rootStore = {
	cart: new UserProductCart(),
	favourites: new FavouritesProducts(),
	comparison: new ComparisonStore(),
	history: new ProductHistory(),
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

const useProductHistory = (): ProductHistory => {
	return useContext(RootStoreContext).history;
};

interface UserSession {
	UID: string;
	UserAgent: string;
	cart: { article: string; count: number }[];
	favourites: ProductDataShort[];
	history: ProductDataShort[];
	comparison: string[];
	created: Date;
	expires: Date;
}

function updateRootStoreData(session?: UserSession): void {
	if (session) {
		rootStore.cart.hydrate(session.cart);
		rootStore.favourites.hydrate(session.favourites);
		rootStore.comparison.hydrate(session.comparison);
		rootStore.history.hydrate(session.history);
	}
}

function MobxStoreSessionBasedContext({ children, session }: { children: ReactElement | ReactElement[] | null; session?: UserSession }) {
	const [sessionData, setSessionData] = useState<UserSession | undefined>(session);

	useEffect(() => {
		if (!sessionData) {
			get('/api/session/get').then((response) => {
				setSessionData(response.data);
			});
		}
	}, [sessionData]);

	updateRootStoreData(sessionData);
	return <RootStoreContext.Provider value={rootStore}>{children}</RootStoreContext.Provider>;
}

export { MobxStoreSessionBasedContext, useStore, useUserProductCart, useFavouritesProducts, useComparinsonProducts, useProductHistory };
export type { UserSession };
