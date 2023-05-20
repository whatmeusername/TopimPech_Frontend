import { action, makeObservable, observable } from 'mobx';
import { ProductData } from '../components/CatalogComponents/Cards/interface';
import axios from 'axios';

interface FavouritesItem {
	name: string;
	categories: ProductData['categories'];
	images: ProductData['images'];
	price: number;
	sale: number;
	article: string;
}

class FavouritesProducts {
	@observable public items: FavouritesItem[] = [];

	constructor() {
		makeObservable(this);
	}

	public getCount(): number {
		return this.items.length;
	}

	@action
	public add(payload: ProductData): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx === -1) {
			this.items.unshift({
				name: payload.name,
				categories: payload.categories,
				images: payload.images,
				price: payload.price,
				sale: payload.sale,
				article: payload.article,
			});
			axios({ url: '/api/session/update', method: 'POST', data: { key: 'favourites', items: this.items } });
		}
	}

	@action
	public remove(payload: ProductData | FavouritesItem): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx !== -1) {
			this.items.splice(existIdx, 1);
		}
	}

	public hydrate(data: FavouritesItem[]): void {
		this.items = data;
	}

	public has(article: string): boolean {
		return this.items.find((i) => i.article === article) !== undefined;
	}
}

export { FavouritesProducts };
export type { FavouritesItem };