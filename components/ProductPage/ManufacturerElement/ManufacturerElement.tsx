import { ProductBaseData } from '../../CatalogComponents/Cards/interface';

const ManufacturerElement = ({ ManufacturerData }: { ManufacturerData: ProductBaseData }) => {
	return (
		<div className="product__page__manufacturer">
			<span className="product__page__manufacturer__label">Производитель:</span>
			<span className="product__page__manufacturer__name">{ManufacturerData.name}</span>
		</div>
	);
};

export { ManufacturerElement };
