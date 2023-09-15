import { useGlobalContext } from '../../context/GlobalContext/GlobalContext';
import { ProductsGridLayoutItem } from '../Shared/ProductsGridLayoutItem/ProductsGridLayoutItem';

import './RecomendationElement.scss';

function RecomendationElement({ limit, className }: { limit?: number; className?: string }) {
	let recomendationProducts = useGlobalContext().recomendation.data;

	if (limit) {
		recomendationProducts = recomendationProducts.slice(0, limit);
	}

	return (
		<div className={`recomendation__products__wrapper ${className ?? ''}`}>
			<div className="recomendation__products__head">
				<h2 className="recomendation__products__header">Рекомендуем вам</h2>
			</div>
			<div className="recomendation__products__content products__grid__layout">
				{recomendationProducts.map((product) => {
					return <ProductsGridLayoutItem product={product} key={`recomendation__${product.slug}`} />;
				})}
			</div>
		</div>
	);
}

export { RecomendationElement };
