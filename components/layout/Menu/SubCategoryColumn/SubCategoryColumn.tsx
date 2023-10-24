import { ReactElement } from 'react';
import { CategoryData } from '../GeneralElements';
import { SubCategoryItem } from '../SubCategoryItem/SubCategoryItem';

import './SubCategoryColumn.scss';

function SubCategoryColumn({ data }: { data: CategoryData }): ReactElement {
	return (
		<div className="sub__categories__column">
			<SubCategoryItem data={data} className="sub__categories__column__item" showCount={true} />
			{data.child.length > 0 ? (
				<div className="sub__categories__column__sub__wrapper">
					{data.child.map((child) => {
						return <SubCategoryItem data={child} className="sub__categories__column__item__sub" key={child.slug} showCount={false} />;
					})}
				</div>
			) : null}
		</div>
	);
}

export { SubCategoryColumn };