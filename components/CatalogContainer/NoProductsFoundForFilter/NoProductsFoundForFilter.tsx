import { ClearFiltersButton } from '../../CatalogPage/Filter/ClearFilterButton/ClearFiltersButton';
import { SearchIcon } from '../../IconsElements';
import './NoProductsFoundForFilter.scss';

function NoProductsFoundForFilter() {
	return (
		<div className="products__filter__not__found__wrapper">
			<SearchIcon className="products__filter__not__found__icon" />
			<h3 className="products__filter__not__found__header">По этим параметрам данные товары отсуствуют</h3>
			<p className="products__filter__not__found__text">Попробуйти найти товар используя другие параметры или воспользуйтесь поиском</p>
			<ClearFiltersButton />
		</div>
	);
}

export { NoProductsFoundForFilter };
