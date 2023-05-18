import { action, makeObservable, observable } from 'mobx';

interface CenterModals {
	[K: string]: boolean;
}
class CenterModalControl {
	@observable public Modals: CenterModals = {};
	constructor() {
		makeObservable(this);
	}

	public getModal(id: string) {
		return this.Modals[id];
	}

	@action
	public toggle(id: string) {
		this.Modals[id] = !this.Modals[id] ?? true;
		document.body.style.overflow = this.Modals[id] ? 'hidden' : '';
	}
}

const centerModalControl = new CenterModalControl();
export { centerModalControl, CenterModalControl };
