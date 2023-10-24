import Link from 'next/link';
import { menuModalControl } from '../../../../store/MenuModal';
import { CategoryData } from '../GeneralElements';

import './SubCategoryItem.scss';

function SubCategoryItem({ data, className, showCount }: { data: CategoryData; className: string; showCount?: boolean }): JSX.Element {
	return (
		<Link href={`/catalog/${data.slug}`} onClick={() => menuModalControl.toggle(false)} className={className} prefetch={false}>
			<span className={`${className}__text`}>{data.name}</span>
			{showCount ? <span className={'sub__categories__column__item__count'}>{data.productCount}</span> : null}
		</Link>
	);
}

export { SubCategoryItem };
