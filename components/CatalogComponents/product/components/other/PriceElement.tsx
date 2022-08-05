const PriceElement = ({ price, sale = 0 }: { price: number; sale: number }) => {
	sale = 25;
	const PriceTag = sale > 0 ? Number((price - (price * sale) / 100).toFixed(0)) : price;
	return (
		<div className="product__card__price__wrapper">
			<span className={`${sale > 0 ? 'product__card__price__sale' : 'product__card__price'} price__tag`}>
				{PriceTag.toLocaleString('ru')}{' '}
			</span>
			{sale > 0 ? <span className="product__card__price__before__sale">{price.toLocaleString('ru')} </span> : ''}
		</div>
	);
};

export default PriceElement;
