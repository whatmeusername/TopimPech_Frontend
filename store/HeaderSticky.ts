import { action, makeObservable, observable } from 'mobx';

class HeaderSticky {
	@observable public toggled = true;
	constructor() {
		makeObservable(this);
	}

	@action
	toggle(force?: boolean): void {
		this.toggled = force !== undefined ? force : !this.toggled;
	}
}

const headerSticky = new HeaderSticky();

export { headerSticky };
