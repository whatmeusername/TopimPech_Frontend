import { action, makeObservable, observable } from 'mobx';
import axios from 'axios';

class UserProductCart {
	@observable public raw_items: { id: string; count: number }[] = [];
	@observable public updated: Date = new Date();

	constructor() {
		makeObservable(this);
	}

	public getCount(): number {
		return this.raw_items.reduce((prev, item) => {
			prev += item.count;
			return prev;
		}, 0);
	}

	@action
	public addItem(payload: { id: string; count: number }) {
		const existing = this.raw_items.find((item) => item.id === payload.id);
		if (existing) {
			existing.count += payload.count > 0 ? payload.count : 1;
		} else {
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'cart',
					items: JSON.parse(JSON.stringify([...this.raw_items, { id: payload.id, count: payload.count > 0 ? payload.count : 1 }])),
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					this.raw_items.push({ id: payload.id, count: payload.count > 0 ? payload.count : 1 });
				}
			});
		}
	}

	@action
	public removeFromItem(payload: { id: string; count: number }) {
		const existingIndex = this.raw_items.findIndex((item) => item.id === payload.id);
		if (existingIndex !== -1) {
			const cartRawItem = this.raw_items[existingIndex];
			if (cartRawItem.count - payload.count <= 0) {
				this.raw_items.splice(existingIndex, 1);
			} else {
				cartRawItem.count -= payload.count;
			}
		}
	}

	@action
	public deleteItem(payload: string) {
		const existingIndex = this.raw_items.findIndex((item) => item.id === payload);
		if (existingIndex !== -1) {
			this.raw_items.splice(existingIndex, 1);
		}
	}

	public hydrate(data: { id: string; count: number }[]): void {
		this.raw_items = data;
	}

	public has(id: string): boolean {
		return this.raw_items.find((i) => i.id === id) !== undefined;
	}
}

export { UserProductCart };
