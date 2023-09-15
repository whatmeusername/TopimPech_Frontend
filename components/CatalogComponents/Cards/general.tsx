import { ReactElement } from 'react';
import { ProductData } from './interface';

function ProductCardTags({ product }: { product: ProductData }): ReactElement | null {
	if (product.ProductTags?.length === 0) return null;
	return (
		<div className="product__card__product__tags">
			{product.ProductTags.map((tag) => {
				return (
					<div className="product__card__product__tags__item" key={tag.name}>
						<p className="product__card__product__tags__item__text">{tag.name}</p>
					</div>
				);
			})}
		</div>
	);
}

export { ProductCardTags };
