import axios from 'axios';
import { observable, makeObservable, action, runInAction } from 'mobx';
import { ProductData, ProductDataShort } from '../components/CatalogComponents/Cards/interface';

class ComparisonStore {
	@observable public productsArticles: string[] = [];

	constructor() {
		makeObservable(this);
	}

	@action
	public add(payload: string | ProductData | ProductDataShort) {
		const payloadArticle = typeof payload === 'string' ? payload : payload.article;
		const existing = this.productsArticles.find((article) => article === payloadArticle);
		if (!existing) {
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'comparison',
					items: JSON.parse(JSON.stringify([...this.productsArticles, payloadArticle])),
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					runInAction(() => {
						this.productsArticles.push(payloadArticle);
					});
				}
			});
		}
	}

	@action
	public remove(payload: string | ProductData | ProductDataShort) {
		const payloadArticle = typeof payload === 'string' ? payload : payload.article;
		const existingIndex = this.productsArticles.findIndex((id) => id === payloadArticle);
		if (existingIndex !== -1) {
			const data = JSON.parse(JSON.stringify([...this.productsArticles]));
			data.splice(existingIndex, 1);
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'comparison',
					items: data,
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					runInAction(() => {
						this.productsArticles.splice(existingIndex, 1);
					});
				}
			});
		}
	}
	@action
	public hydrate(data: string[]): void {
		this.productsArticles = data;
	}

	public getCount(): number {
		return this.productsArticles.length;
	}

	public has(payload: string): boolean {
		return this.productsArticles.find((article) => article === payload) !== undefined;
	}
}

export { ComparisonStore };
