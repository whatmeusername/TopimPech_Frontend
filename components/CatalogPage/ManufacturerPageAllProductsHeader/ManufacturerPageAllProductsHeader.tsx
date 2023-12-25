import { declOfProduct } from '../../../utils';
import { PaginatorData } from '../../CatalogContainer/Paginator/interface';
import './ManufacturerPageAllProductsHeader.scss';

function ManufacturerPageAllProductsHeader({ paginator }: { paginator: PaginatorData }) {
	return (
		<div className="manufacturer__page__all__products__header__wrapper">
			<h2 className="manufacturer__page__all__products__header">Все товары производителя</h2>
			<p className="manufacturer__page__all__products__counter">
				Найдено {paginator.count} {declOfProduct(paginator.count)}
			</p>
		</div>
	);
}

export { ManufacturerPageAllProductsHeader };
