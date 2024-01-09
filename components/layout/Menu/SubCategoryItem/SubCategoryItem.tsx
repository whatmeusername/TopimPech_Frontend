import Link from 'next/link';
import { menuModalControl } from '../../../../store/MenuModal';
import { CategoryData } from '../GeneralElements';

import './SubCategoryItem.scss';

function SubCategoryItem({ category, className, showCount }: { category: CategoryData; className: string; showCount?: boolean }): JSX.Element {
	return (
		<Link href={`/catalog/${category.slug}`} onClick={() => menuModalControl.toggle(false)} className={className} prefetch={false}>
			<span className={`${className}__text`}>{category.name}</span>
			{showCount ? <span className={'sub__categories__column__item__count'}>{category.productCount}</span> : null}
		</Link>
	);
}

export { SubCategoryItem };
