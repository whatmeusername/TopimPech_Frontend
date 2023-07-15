import Link from 'next/link';
import { toggleWindowScroll } from '../../../../utils';
import { ProductData } from '../../../CatalogComponents/Cards/interface';
import PriceElement from '../../../CatalogComponents/PriceElement.tsx/PriceElement';

import './SearchItemElement.scss';
import { NO_IMAGE_SRC } from '../../../const';

function SearchItemElement({ product, ToggleModal }: { product: ProductData; ToggleModal: (fixedState?: boolean | undefined) => void }) {
	return (
		<Link
			className="search__result__item"
			href={`/product/${product.article}/`}
			onClick={() => {
				ToggleModal(false);
				toggleWindowScroll(true);
			}}
		>
			<div className="search__result__item__left">
				<div className="search__result__item__image__wrapper">
					<img
						src={product.images.length > 0 ? `/api${product.images[0].path}` : NO_IMAGE_SRC}
						alt={product.name}
						className="search__result__item__image"
						onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
					/>
				</div>
				<div className="search__result__item__content">
					<div className="search__result__label__wrapper">
						<span className="search__result__label">{product.name}</span>
						<span className="search__result__article">Артикул: {product.article}</span>
					</div>
					<div className="search__result__price__wrapper">
						<PriceElement product={product} />
					</div>
				</div>
			</div>
		</Link>
	);
}

export { SearchItemElement };
