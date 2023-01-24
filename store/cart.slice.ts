import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type CartSliceInitialState = {
	raw_items: { id: number; count: number }[];
	data: { [K: string]: any }[];
	updated: Date;
};

const initialState: CartSliceInitialState = {
	raw_items: [],
	data: [],
	updated: new Date(),
};

const cartSlice = createSlice({
	name: 'cart',
	initialState: initialState,
	reducers: {
		addItem(state: CartSliceInitialState, action: PayloadAction<{ id: number; count: number }>) {
			const payload = action.payload;
			const existing = state.raw_items.find((item) => item.id === payload.id);
			if (existing) {
				existing.count += payload.count > 0 ? payload.count : 1;
			} else {
				state.raw_items.push({ id: payload.id, count: payload.count > 0 ? payload.count : 1 });
			}
		},
		removeFromItem(state: CartSliceInitialState, action: PayloadAction<{ id: number; count: number }>) {
			const payload = action.payload;
			const existingIndex = state.raw_items.findIndex((item) => item.id === payload.id);
			if (existingIndex !== -1) {
				const cartRawItem = state.raw_items[existingIndex];
				if (cartRawItem.count - payload.count <= 0) {
					state.raw_items.splice(existingIndex, 1);
				} else {
					cartRawItem.count -= payload.count;
				}
			}
		},
		deleteItem(state: CartSliceInitialState, action: PayloadAction<number>) {
			const existingIndex = state.raw_items.findIndex((item) => item.id === action.payload);
			if (existingIndex !== -1) {
				state.raw_items.splice(existingIndex, 1);
			}
		},
	},
});

export const { addItem, removeFromItem, deleteItem } = cartSlice.actions;

export default cartSlice.reducer;
