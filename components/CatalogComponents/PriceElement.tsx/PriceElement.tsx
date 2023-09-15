import { ProductData, ProductDataShort } from '../Cards/interface';

const CalculateSale = (price: number, amount: number): number => {
	return price - (price * amount) / 100;
};

const PriceElement = ({
	product,
	quantity = 1,
	includeMeta,
}: {
	product: ProductData | ProductDataShort;
	quantity?: number;
	includeMeta?: boolean;
}) => {
	const price = product.price;
	const sale = product.sale;
	let PriceTag = sale > 0 ? Number(CalculateSale(price, sale).toFixed(0)) : price;
	PriceTag = quantity > 0 ? PriceTag * quantity : PriceTag;
	return (
		<div className="product__card__price__wrapper">
			{includeMeta ? (
				<>
					<meta itemProp="price" content={PriceTag.toFixed(2)} />
					<meta itemProp="priceCurrency" content="RUB" />
				</>
			) : null}
			<span className={`${sale > 0 ? 'product__card__price__sale' : 'product__card__price'} price__tag`}>{PriceTag.toLocaleString('ru')} </span>
			{sale > 0 ? <span className="product__card__price__before__sale">{price.toLocaleString('ru')} </span> : ''}
		</div>
	);
};

export { CalculateSale };

export default PriceElement;
