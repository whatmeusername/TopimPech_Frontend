import { ReactElement } from 'react';
import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import { Manufacturer } from '../../CatalogComponents/Cards/interface';
import './ManufacturerInfoElement.scss';
import { Capitalize } from '../../../utils/Capitalize';

function ManufacturerInfoElement({ manufacturer }: { manufacturer: Manufacturer | undefined }): ReactElement | null {
	if (!manufacturer || !manufacturer.description) return null;
	return (
		<div className="manufacturer__info__element__wrapper">
			<div className="manufacturer__info__element">
				<div className="manufacturer__info__element__image__wrapper">
					{manufacturer.image ? (
						<Image
							className="manufacturer__info__element__image"
							onError={(e) => {
								const target = e.target as HTMLImageElement;
								target.srcset = NO_IMAGE_SRC;
								target.src = NO_IMAGE_SRC;
							}}
							src={`/api${manufacturer.image.path}`}
							alt={manufacturer.name}
							width={150}
							height={150}
							style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
						/>
					) : (
						<p className="manufacturer__info__element__label">{manufacturer.name}</p>
					)}
				</div>
				<div className="manufacturer__info__element__content">
					<div className="manufacturer__info__element__header__wrapper">
						<h2 className="manufacturer__info__element__header">{Capitalize(manufacturer.name)}</h2>
					</div>
					<p className="manufacturer__info__element__descriptions">{manufacturer.description}</p>
				</div>
			</div>
		</div>
	);
}

export { ManufacturerInfoElement };
