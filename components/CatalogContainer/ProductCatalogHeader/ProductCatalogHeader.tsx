import ChangeProductView from '../ChangeProductView/ChangeProductView';
import { CatalogView } from '../ChangeProductView/interface';
import ProductSort from '../ProductSort/ProductSort';

import './ProductCatalogHeader.scss';

const ProductCatalogHeader = ({ disabled, setCatalogView }: { disabled: boolean; setCatalogView: (value: CatalogView) => void }) => {
	return (
		<div className="product__catalog__header">
			<ProductSort disabled={disabled} />
			<ChangeProductView disabled={disabled} setCatalogView={setCatalogView} />
		</div>
	);
};

export { ProductCatalogHeader };
