import Link from 'next/link';
import { ReactElement } from 'react';

import './NotFoundPage.scss';

function NotFoundPage(): ReactElement {
	return (
		<div className="page__not__found__wrapper">
			<div className="page__not__found">
				<p className="page__not__found__text">Упс! К сожалению, по вашему запросу ничего не было найдено</p>
				<Link href={'/'} className="return__to_main_page__button">
					Вернуться на главную
				</Link>
			</div>
		</div>
	);
}

export { NotFoundPage };
