import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { ReactElement } from 'react';

import './RecomendationAdElement.scss';
import Link from 'next/link';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';

function RecomendationAdElement(): ReactElement {
	const recomendationProduct = useGlobalContext().recomendation.data[0];
	return (
		<Link className="recomendation__ad__element" href={`/product/${recomendationProduct.slug}`}>
			<div className="recomendation__ad__element__content">
				<h2 className="recomendation__ad__element__header">Возможно вы искали</h2>
				<div className="recomendation__ad__element__image__wrapper">
					<Image
						className="recomendation__ad__element__image"
						onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
						src={`/api${recomendationProduct.images?.[0]?.path}`}
						alt={recomendationProduct.name}
						width={250}
						height={250}
						style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
					/>
				</div>
				<div className="recomendation__ad__element__label__wrapper">
					<p className="recomendation__ad__element__label">{recomendationProduct.name}</p>
					<PriceElement product={recomendationProduct} />
				</div>
			</div>
		</Link>
	);
}

export { RecomendationAdElement };
