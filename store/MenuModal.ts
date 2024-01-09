import { action, makeObservable, observable } from 'mobx';
import { CategoryData } from '../context/Categories';

class MenuModalControl {
	@observable public toggled = false;
	@observable public selectedCategory = '';
	constructor() {
		makeObservable(this);
	}

	@action
	public toggle(force?: boolean) {
		this.toggled = force ?? !this.toggled;
		document.body.style.overflow = this.toggled ? 'hidden' : '';
	}

	@action
	public setCategory(category: CategoryData) {
		this.selectedCategory = category.slug;
	}
}

const menuModalControl = new MenuModalControl();
export { menuModalControl };
