import { action, makeObservable, observable } from 'mobx';

class MenuModalControl {
	@observable public toggled = false;
	constructor() {
		makeObservable(this);
	}

	@action
	public toggle(force?: boolean) {
		this.toggled = force ?? !this.toggled;
		document.body.style.overflow = this.toggled ? 'hidden' : '';
	}
}

const menuModalControl = new MenuModalControl();
export { menuModalControl };
