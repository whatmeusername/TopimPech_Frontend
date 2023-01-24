import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import cartReducer from './cart.slice';
import historyReducer from './history.slice';

const reducers = combineReducers({ cart: cartReducer, productHistory: historyReducer });

const persistConfig = {
	key: 'root',
	storage,
	whitelist: ['cart', 'productHistory'],
};

const persistedStore = persistReducer(persistConfig, reducers);

const store = configureStore({
	reducer: persistedStore,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
				serializableCheck: false,
			},
		}),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
