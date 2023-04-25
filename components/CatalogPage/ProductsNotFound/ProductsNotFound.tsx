import Link from 'next/link';
import { ReactElement } from 'react';

function ProductsNotFound(): ReactElement {
	return (
		<div className="catalog__page__not__fount__wrapper">
			<div className="catalog__page__not__found">
				<p className="catalog__page__not__found__text">Упс! К сожалению, по вашему запросу ничего не было найдено</p>
				<Link href={'/'} className="return__to_main_page__button">
					Вернуться на главную
				</Link>
			</div>
		</div>
	);
}

export { ProductsNotFound };
