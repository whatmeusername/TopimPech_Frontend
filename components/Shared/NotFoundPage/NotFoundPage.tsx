import Link from 'next/link';
import { ReactElement } from 'react';

import './NotFoundPage.scss';
import { Number404 } from '../Number404/Number404';
import { SearchIcon } from '../../IconsElements';

function NotFoundPage({ label, icon }: { label?: string; icon?: 'search' }): ReactElement {
	let iconElement = null;
	if (icon === 'search') {
		iconElement = <SearchIcon className="not__found__icon" />;
	}
	return (
		<div className="page__not__found__wrapper">
			<div className="page__not__found">
				{iconElement ?? <Number404 size="large" />}
				<p className="page__not__found__text">{label ?? 'Упс! К сожалению, по вашему запросу ничего не было найдено'}</p>
				<Link href={'/'} className="return__to_main_page__button">
					Вернуться на главную
				</Link>
			</div>
		</div>
	);
}

export { NotFoundPage };
