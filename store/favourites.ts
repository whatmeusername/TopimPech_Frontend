import { action, makeObservable, observable, runInAction } from 'mobx';
import { ProductData, ProductDataShort } from '../components/CatalogComponents/Cards/interface';
import axios from 'axios';

class FavouritesProducts {
	@observable public items: ProductDataShort[] = [];

	constructor() {
		makeObservable(this);
	}

	public getCount(): number {
		return this.items.length;
	}

	private parseProductData(payload: ProductData | ProductDataShort): ProductDataShort {
		return {
			id: payload.id,
			name: payload.name,
			categories: payload.categories,
			images: payload.images,
			price: payload.price,
			sale: payload.sale,
			article: payload.article,
			slug: payload.slug,
		};
	}

	@action
	public add(payload: ProductData | ProductDataShort): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx === -1) {
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'favourites',
					items: JSON.parse(JSON.stringify([...this.items, this.parseProductData(payload)])),
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					runInAction(() => {
						this.items.push(this.parseProductData(payload));
					});
				}
			});
		}
	}

	@action
	public remove(payload: ProductData | ProductDataShort): void {
		const existIdx = this.items.findIndex((i) => i.article === payload.article);
		if (existIdx !== -1) {
			const data = JSON.parse(JSON.stringify([...this.items]));
			data.splice(existIdx, 1);
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'favourites',
					items: data,
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					runInAction(() => {
						this.items.splice(existIdx, 1);
					});
				}
			});
		}
	}

	@action
	public hydrate(data: ProductDataShort[]): void {
		this.items = data;
	}

	public has(article: string): boolean {
		return this.items.find((i) => i.article === article) !== undefined;
	}
}

export { FavouritesProducts };
