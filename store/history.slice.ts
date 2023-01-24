import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductData } from '../components/CatalogComponents/product/interface';

interface HistorySliceItem {
	name: string;
	mc: string;
	sc: string;
	image: string | null;
	price: number;
	sale: number;
	article: number;
}

const initialState: { items: HistorySliceItem[] } = { items: [] };

const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {
		add(state: { items: HistorySliceItem[] }, action: PayloadAction<ProductData>) {
			const payload = action.payload;
			const existIdx = state.items.findIndex((i) => i.article === payload.article);
			if (existIdx === -1) {
				const image = payload.images.length > 0 ? payload.images[0].path : null;
				state.items.unshift({
					name: payload.name,
					mc: payload.MainCategory.slug,
					sc: payload.MainCategory.slug,
					image: image,
					price: payload.price,
					sale: payload.sale,
					article: payload.article,
				});
				if (state.items.length > 18) {
					state.items = state.items.slice(0, 16);
				}
			} else {
				const d = state.items[existIdx];
				state.items.splice(existIdx, 1);
				state.items.unshift(d);
			}
		},
		remove(state: { items: HistorySliceItem[] }, action: PayloadAction<ProductData>) {
			const payload = action.payload;
			const existIdx = state.items.findIndex((i) => i.article === payload.article);
			if (existIdx !== -1) {
				state.items.splice(existIdx, 1);
			}
		},
	},
});

export type { HistorySliceItem };
export const { add, remove } = historySlice.actions;
export default historySlice.reducer;
