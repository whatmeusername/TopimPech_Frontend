import { action, makeObservable, observable, autorun, toJS, extendObservable } from 'mobx';
import { ProductData } from '../components/CatalogComponents/product/interface';

interface HistorySliceItem {
	name: string;
	mc: string;
	sc: string;
	image: string | null;
	price: number;
	sale: number;
	article: number;
}

class ProductHistory {
	@observable public items: HistorySliceItem[] = [];

	constructor() {
		this.load();
		makeObservable(this);
		autorun(() => {
			this.save();
		});
	}

	@action
	public add(payload: ProductData): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx === -1) {
			const image = payload.images.length > 0 ? payload.images[0].path : null;
			this.items.unshift({
				name: payload.name,
				mc: payload.MainCategory.slug,
				sc: payload.MainCategory.slug,
				image: image,
				price: payload.price,
				sale: payload.sale,
				article: payload.article,
			});
			if (this.items.length > 18) {
				this.items = this.items.slice(0, 16);
			}
		} else {
			const d = this.items[existIdx];
			this.items.splice(existIdx, 1);
			this.items.unshift(d);
		}
	}

	@action
	public remove(payload: ProductData): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx !== -1) {
			this.items.splice(existIdx, 1);
		}
	}

	private load(): void {
		if (typeof window === 'undefined') return;

		const data = localStorage.getItem('cart');
		if (data) {
			extendObservable(this, JSON.parse(data));
		}
	}

	private save(): void {
		const json = JSON.stringify(toJS(this));
		localStorage.setItem('cart', json);
	}
}

const productHistory = new ProductHistory();
export { productHistory };
export type { HistorySliceItem };
