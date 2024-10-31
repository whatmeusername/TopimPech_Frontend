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
				if (category.productCount === 0 || category?.image === undefined) return null;
				return <CategoryItem category={category} key={category.slug} />;
			})}
		</div>
	);
};

const CloseButton = (): ReactElement => {
	return (
		<button className="menu__content__close__button" title="закрыть меню" onClick={() => menuModalControl.toggle(false)}>
			<DeleteIcon className="menu__content__close__button__icon" />
		</button>
	);
};

export { CategoriesColumn, CloseButton };
export type { CategoryData };
