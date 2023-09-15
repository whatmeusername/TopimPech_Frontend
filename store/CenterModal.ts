import { action, makeObservable, observable } from 'mobx';

interface CenterModals {
	[K: string]: boolean;
}
class CenterModalControl {
	@observable public Modals: CenterModals = {};
	@observable private params: any[];
	@observable private paramsId: string;

	constructor() {
		makeObservable(this);
		this.params = [];
		this.paramsId = '';
	}

	public getModal(id: string) {
		return this.Modals[id];
	}

	public getParams(id: string): any[] {
		if (this.paramsId === id) {
			return this.params;
		}
		return [];
	}

	@action
	public toggle(id: string, ...params: any[]): void {
		this.params = params;
		this.paramsId = id;

		this.Modals[id] = !this.Modals[id] ?? true;
		document.body.style.overflow = this.Modals[id] ? 'hidden' : '';
	}
}

const centerModalControl = new CenterModalControl();
export { centerModalControl, CenterModalControl };
