import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';

import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { ReactElement, useEffect, useState } from 'react';

import './RecomendationAdElement.scss';
import Link from 'next/link';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { ProductDataShort } from '../../CatalogComponents/Cards/interface';
import { LoadingBar } from '../../Shared/LoadingBar/LoadingBar';

function RecomendationAdElement(): ReactElement {
	const recomendationProducts = useGlobalContext().recomendation.data;
	const [recomendationProduct, setRecomendationProduct] = useState<ProductDataShort>(null!);

	useEffect(() => {
		setRecomendationProduct(recomendationProducts[Math.floor(Math.random() * recomendationProducts.length)]);
	}, []);

	return (
		<Link className="recomendation__ad__element" href={recomendationProduct ? `/product/${recomendationProduct.slug}` : '#'}>
			<div className="recomendation__ad__element__content">
				{recomendationProduct ? (
					<>
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
					</>
				) : (
					<LoadingBar />
				)}
			</div>
		</Link>
	);
}

export { RecomendationAdElement };
