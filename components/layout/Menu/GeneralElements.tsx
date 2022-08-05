import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './menu.module.scss';

import { useToggleModalContext } from './Menu';

import { CategoryData } from '../../GlobalContext/Categories/interface';

const CategoriesColumn = ({
	categories,
	CategoryItem,
}: {
	categories: CategoryData[];
	CategoryItem: (...rest: any) => JSX.Element;
}): JSX.Element => {
	return (
		<div className={styles.menu__category__column}>
			{(categories ?? []).map((category) => {
				return <CategoryItem category={category} key={category.slug} />;
			})}
		</div>
	);
};

const CloseButton = (): JSX.Element => {
	const closeModalFunction = useToggleModalContext();
	return (
		<button className={styles.menu__content__close__button}>
			<FontAwesomeIcon
				icon={faXmark}
				className={styles.menu__content__close__button__icon}
				onClick={() => closeModalFunction(false)}
			/>
		</button>
	);
};

export { CategoriesColumn, CloseButton };
export type { CategoryData };
