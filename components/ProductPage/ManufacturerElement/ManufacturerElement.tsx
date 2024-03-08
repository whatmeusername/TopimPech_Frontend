import { ProductData } from '../../CatalogComponents/Cards/interface';
import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Capitalize } from '../../../utils/Capitalize';
import Link from 'next/link';
import './ManufacturerElement.scss';
import { ReactElement } from 'react';

function ManufacturerElement({ product }: { product: ProductData }): ReactElement | null {
	if (!product.manufacturer) return null;

	const ManufacturerData = product.manufacturer;
	return (
		<Link className="product__page__manufacturer" href={`/catalog/manufacturer/${ManufacturerData.slug}/`}>
			{ManufacturerData.image ? (
				<div className="product__page__manufacturer__image__wrapper">
					<Image
						className="product__page__manufacturer__image"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.srcset = NO_IMAGE_SRC;
							target.src = NO_IMAGE_SRC;
						}}
						src={`/api${ManufacturerData.image.path}`}
						alt={ManufacturerData.name}
						width={150}
						height={150}
						style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
					/>
				</div>
			) : (
				<p className="product__page__manufacturer__label">Производитель:</p>
			)}

			<p className="product__page__manufacturer__name">{Capitalize(ManufacturerData.name)}</p>
		</Link>
	);
}

export { ManufacturerElement };
