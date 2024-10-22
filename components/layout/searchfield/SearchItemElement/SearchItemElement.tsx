import Link from 'next/link';
import { toggleWindowScroll } from '../../../../utils';
import { ProductData } from '../../../CatalogComponents/Cards/interface';
import PriceElement from '../../../CatalogComponents/PriceElement.tsx/PriceElement';
import parse from 'html-react-parser';

import './SearchItemElement.scss';
import { NO_IMAGE_SRC } from '../../../const';

import Image from 'next/image';

function SearchItemElement({
	product,
	highlight,
	ToggleModal,
}: {
	product: ProductData;
	highlight: { [K: string]: string[] };
	ToggleModal: (fixedState?: boolean | undefined) => void;
}) {
	return (
		<Link
			className="search__result__item"
			href={`/product/${product.slug}/`}
			onClick={() => {
				ToggleModal(false);
				toggleWindowScroll(true);
			}}
		>
			<div className="search__result__item__left">
				<div className="search__result__item__image__wrapper">
					<Image
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.srcset = NO_IMAGE_SRC;
							target.src = NO_IMAGE_SRC;
						}}
						src={product.images.length > 0 ? `/api${product.images[0].path}` : NO_IMAGE_SRC}
						unoptimized={product?.images?.[0]?.path?.endsWith('.gif')}
						alt={product.name}
						className="search__result__item__image"
						width={40}
						height={40}
						quality={60}
						style={{ objectFit: 'contain', maxInlineSize: '100%' }}
					/>
				</div>
				<div className="search__result__item__content">
					<div className="search__result__label__wrapper">
						<span className="search__result__label">{highlight?.['name'] ? parse(highlight['name'][0]) : product.name}</span>
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
