import { action, makeObservable, observable, autorun, toJS, extendObservable } from 'mobx';
import { ProductData } from '../components/CatalogComponents/Cards/interface';

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
		this.load();
		makeObservable(this);
		autorun(() => {
			this.save();
		});
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
		}
	}

	@action
	public remove(payload: ProductData | FavouritesItem): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx !== -1) {
			this.items.splice(existIdx, 1);
		}
	}

	public has(article: string): boolean {
		return this.items.find((i) => i.article === article) !== undefined;
	}

	private load(): void {
		if (typeof window === 'undefined') return;

		const data = localStorage.getItem('favourites');
		if (data) {
			extendObservable(this, JSON.parse(data));
		}
	}

	private save(): void {
		if (typeof window === 'undefined') return;

		const json = JSON.stringify(toJS(this));
		localStorage.setItem('favourites', json);
	}
}

const favouritesProducts = new FavouritesProducts();
export { favouritesProducts, FavouritesProducts };
export type { FavouritesItem };
