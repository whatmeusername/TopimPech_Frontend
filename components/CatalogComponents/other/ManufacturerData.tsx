import { ProductData } from '../Cards/interface';

function ManufacturerData({ product }: { product: ProductData }): JSX.Element {
	return (
		<div className="product__card__manufacturer__data__wrapper">
			{product.manufacturer ? (
				<span className=" product__card__manufacturer__data product__card__manufacturer">{product.manufacturer.name}</span>
			) : (
				''
			)}
			{product.manufacturer && product.type ? <span className="product__card__slash">/</span> : ''}
			{product.type ? <span className="product__card__manufacturer__data product__card__type">{product.type.name}</span> : ''}
		</div>
	);
}

export default ManufacturerData;
