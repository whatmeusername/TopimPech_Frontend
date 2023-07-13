import { action, makeObservable, observable } from 'mobx';
import { ProductData, ProductDataShort } from '../components/CatalogComponents/Cards/interface';
import axios from 'axios';

class ProductHistory {
	@observable public items: ProductDataShort[] = [];
	private isHydrated = false;
	private limit = 16;

	constructor() {
		makeObservable(this);
	}

	private GetHistorySliceItem(product: ProductData): ProductDataShort {
		return {
			id: product.id,
			slug: product.slug,
			name: product.name,
			categories: product.categories,
			images: product.images,
			price: product.price,
			sale: product.sale,
			article: product.article,
		};
	}

	public getWithExclude(article: string): ProductDataShort[] {
		return this.items.filter((i) => i.article !== article);
	}

	@action
	public add(payload: ProductData): void {
		if (!this.isHydrated) return;

		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx === -1) {
			const data = this.GetHistorySliceItem(payload);
			this.items.unshift(data);

			if (this.items.length > this.limit) {
				this.items = this.items.slice(0, this.limit);
			}

			console.log(JSON.parse(JSON.stringify([...this.items])));
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'history',
					items: JSON.parse(JSON.stringify([...this.items])),
				},
			});
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

	@action
	public hydrate(payload: ProductDataShort[]) {
		this.items = payload;
		this.isHydrated = true;
	}
}

export { ProductHistory };
