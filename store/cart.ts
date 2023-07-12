import { action, makeObservable, observable, runInAction } from 'mobx';
import axios from 'axios';

interface CartItem {
	article: string;
	count: number;
}
class UserProductCart {
	@observable public items: CartItem[] = [];
	@observable public updated: Date = new Date();
	private timeout: ReturnType<typeof setTimeout> | undefined;

	constructor() {
		makeObservable(this);
	}

	public getCount(): number {
		return this.items.reduce((prev, item) => {
			prev += item.count;
			return prev;
		}, 0);
	}

	@action
	public add(payload: CartItem) {
		const existing = this.items.find((item) => item.article === payload.article);
		if (!existing) {
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'cart',
					items: JSON.parse(JSON.stringify([...this.items, { article: payload.article, count: payload.count > 0 ? payload.count : 1 }])),
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					runInAction(() => {
						this.items.push({ article: payload.article, count: payload.count > 0 ? payload.count : 1 });
					});
				}
			});
		}
	}

	private update() {
		axios({
			url: '/api/session/update',
			method: 'POST',
			data: {
				key: 'cart',
				items: JSON.parse(JSON.stringify(this.items)),
			},
		});
	}

	@action
	public increment(payload: CartItem) {
		const existing = this.items.find((item) => item.article === payload.article);
		if (existing) {
			clearTimeout(this.timeout);
			existing.count += payload.count > 0 ? payload.count : 1;
			this.timeout = setTimeout(() => this.update(), 250);
		}
	}

	@action
	public decrement(payload: CartItem) {
		const existing = this.items.find((item) => item.article === payload.article);
		if (existing && existing.count > payload.count) {
			clearTimeout(this.timeout);
			existing.count -= payload.count > 0 ? payload.count : 1;
			this.timeout = setTimeout(() => this.update(), 250);
		} else if (existing && existing.count <= payload.count) {
			clearTimeout(this.timeout);
			this.delete(payload.article);
		}
	}

	@action
	public delete(payload: string) {
		const existingIndex = this.items.findIndex((item) => item.article === payload);
		if (existingIndex !== -1) {
			const dataCopy = JSON.parse(JSON.stringify(this.items));
			dataCopy.splice(existingIndex, 1);
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'cart',
					items: JSON.parse(JSON.stringify(dataCopy)),
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					runInAction(() => {
						this.items = dataCopy;
					});
				}
			});
		}
	}

	@action
	public clear() {
		this.items = [];
	}

	public hydrate(data: { article: string; count: number }[]): void {
		runInAction(() => {
			this.items = data;
		});
	}

	public has(article: string): boolean {
		return this.items.find((i) => i.article === article) !== undefined;
	}

	public isEmpty(): boolean {
		return this.items.length === 0;
	}

	public get(article: string): CartItem | undefined {
		return this.items.find((i) => i.article === article);
	}
}

export type { CartItem };
export { UserProductCart };
