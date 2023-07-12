const CalculateSale = (price: number, amount: number): number => {
	return price - (price * amount) / 100;
};

const PriceElement = ({ price, sale = 0, quantity = 1 }: { price: number; sale: number; quantity?: number }) => {
	let PriceTag = sale > 0 ? Number(CalculateSale(price, sale).toFixed(0)) : price;
	PriceTag = quantity > 0 ? PriceTag * quantity : PriceTag;
	return (
		<div className="product__card__price__wrapper">
			<span className={`${sale > 0 ? 'product__card__price__sale' : 'product__card__price'} price__tag`}>{PriceTag.toLocaleString('ru')} </span>
			{sale > 0 ? <span className="product__card__price__before__sale">{price.toLocaleString('ru')} </span> : ''}
		</div>
	);
};

export { CalculateSale };

export default PriceElement;
