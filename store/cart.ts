import { action, makeObservable, observable, autorun, toJS, extendObservable } from 'mobx';

class UserProductCart {
	@observable public raw_items: { id: number; count: number }[] = [];
	@observable public data: { [K: string]: any }[] = [];
	@observable public updated: Date = new Date();

	constructor() {
		this.load();
		makeObservable(this);
		autorun(() => {
			this.save();
		});
	}

	public getCount(): number {
		return this.raw_items.reduce((prev, item) => {
			prev += item.count;
			return prev;
		}, 0);
	}

	@action
	public addItem(payload: { id: number; count: number }) {
		const existing = this.raw_items.find((item) => item.id === payload.id);
		if (existing) {
			existing.count += payload.count > 0 ? payload.count : 1;
		} else {
			this.raw_items.push({ id: payload.id, count: payload.count > 0 ? payload.count : 1 });
		}
	}

	@action
	public removeFromItem(payload: { id: number; count: number }) {
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

	@action public deleteItem(payload: number) {
		const existingIndex = this.raw_items.findIndex((item) => item.id === payload);
		if (existingIndex !== -1) {
			this.raw_items.splice(existingIndex, 1);
		}
	}

	public has(id: number): boolean {
		return this.raw_items.find((i) => i.id === id) !== undefined;
	}

	private load(): void {
		if (typeof window === 'undefined') return;

		const data = localStorage.getItem('cart');
		if (data) {
			extendObservable(this, JSON.parse(data));
		}
	}

	private save(): void {
		if (typeof window === 'undefined') return;

		const json = JSON.stringify(toJS(this));

		localStorage.setItem('cart', json);
	}
}

const userProductCart = new UserProductCart();
export { userProductCart };
