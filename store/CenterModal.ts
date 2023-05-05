import { action, makeObservable, observable } from 'mobx';

class CenterModalControl {
	@observable public isToggled = false;
	constructor() {
		makeObservable(this);
	}

	@action
	public toggle() {
		this.isToggled = !this.isToggled;
		document.body.style.overflow = this.isToggled ? 'hidden' : '';
	}
}

const centerModalControl = new CenterModalControl();
export { centerModalControl };
