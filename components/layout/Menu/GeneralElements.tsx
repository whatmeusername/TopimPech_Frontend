import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './menu.scss';

import { CategoryData } from '../../../context/Categories/interface';
import { menuModalControl } from '../../../store/MenuModal';

const CategoriesColumn = ({ categories, CategoryItem }: { categories: CategoryData[]; CategoryItem: (...rest: any) => JSX.Element }): JSX.Element => {
	return (
		<div className="menu__category__column">
			{(categories ?? []).map((category) => {
				return <CategoryItem category={category} key={category.slug} />;
			})}
		</div>
	);
};

const CloseButton = (): JSX.Element => {
	return (
		<button className="menu__content__close__button" title="закрыть меню">
			<FontAwesomeIcon icon={faXmark} className="menu__content__close__button__icon" onClick={() => menuModalControl.toggle(false)} />
		</button>
	);
};

export { CategoriesColumn, CloseButton };
export type { CategoryData };
