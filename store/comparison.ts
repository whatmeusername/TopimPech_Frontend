import axios from 'axios';
import { observable, makeObservable, action } from 'mobx';
import { ProductData } from '../components/CatalogComponents/Cards/interface';
import { FavouritesItem } from './favourites';

class ComparisonStore {
	@observable public productsID: number[] = [];

	constructor() {
		makeObservable(this);
	}

	@action
	public add(payload: number | ProductData | FavouritesItem) {
		payload = typeof payload === 'number' ? payload : payload.id;
		const existing = this.productsID.find((id) => id === payload);
		if (!existing) {
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'comparison',
					items: JSON.parse(JSON.stringify([...this.productsID, payload])),
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					this.productsID.push(payload as number);
				}
			});
		}
	}

	@action
	public remove(payload: number | ProductData | FavouritesItem) {
		payload = typeof payload === 'number' ? payload : payload.id;
		const existingIndex = this.productsID.findIndex((id) => id === payload);
		if (existingIndex !== -1) {
			const data = JSON.parse(JSON.stringify([...this.productsID]));
			data.splice(existingIndex, 1);
			axios({
				url: '/api/session/update',
				method: 'POST',
				data: {
					key: 'favourites',
					items: data,
				},
			}).then((response) => {
				if (response.data.status === 'OK') {
					this.productsID.splice(existingIndex, 1);
				}
			});
		}
	}

	public hydrate(data: number[]): void {
		this.productsID = data;
	}

	public getCount(): number {
		return this.productsID.length;
	}

	public has(payload: number): boolean {
		return this.productsID.find((id) => id === payload) !== undefined;
	}
}

export { ComparisonStore };
