import './menu.scss';

import { CategoryData } from '../../../context/Categories/interface';
import { menuModalControl } from '../../../store/MenuModal';
import { DeleteIcon } from '../../IconsElements';
import { ReactElement, ReactNode } from 'react';

const CategoriesColumn = ({
	categories,
	CategoryItem,
}: {
	categories: CategoryData[];
	CategoryItem: (...rest: any) => ReactElement | ReactNode;
}): ReactElement => {
	return (
		<div className="menu__category__column">
			{(categories ?? []).map((category) => {
				return category.productCount > 0 ? <CategoryItem category={category} key={category.slug} /> : null;
			})}
		</div>
	);
};

const CloseButton = (): ReactElement => {
	return (
		<button className="menu__content__close__button" title="закрыть меню">
			<DeleteIcon className="menu__content__close__button__icon" onClick={() => menuModalControl.toggle(false)} />
		</button>
	);
};

export { CategoriesColumn, CloseButton };
export type { CategoryData };
