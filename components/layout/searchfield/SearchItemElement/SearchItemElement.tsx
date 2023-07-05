import Link from 'next/link';
import { toggleWindowScroll } from '../../../../utils';
import { ProductData } from '../../../CatalogComponents/Cards/interface';
import PriceElement from '../../../CatalogComponents/PriceElement.tsx/PriceElement';

import './SearchItemElement.scss';

function SearchItemElement({ data, ToggleModal }: { data: ProductData; ToggleModal: (fixedState?: boolean | undefined) => void }) {
	return (
		<Link
			className="search__result__item"
			href={`/product/${data.article}/`}
			onClick={() => {
				ToggleModal(false);
				toggleWindowScroll(true);
			}}
		>
			<div className="search__result__item__left">
				<div className="search__result__item__image__wrapper">
					<img src={`/api/${data.images.length > 0 ? data.images[0].path : ''}`} alt={data.name} className="search__result__item__image" />
				</div>
				<div className="search__result__item__content">
					<div className="search__result__label__wrapper">
						<span className="search__result__label">{data.name}</span>
						<span className="search__result__article">Артикул: {data.article}</span>
					</div>
					<div className="search__result__price__wrapper">
						<PriceElement sale={data.sale} price={data.price} />
					</div>
				</div>
			</div>
		</Link>
	);
}

export { SearchItemElement };
