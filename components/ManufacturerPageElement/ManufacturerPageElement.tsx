'use client';

import { ReactElement } from 'react';
import type { ManufacturerData } from '../HomePageElement/interface';
import { PrimaryPageHeader } from '../Shared/PrimaryPageHeader/PrimaryPageHeader';
import Image from 'next/image';

import './ManufacturerPageElement.scss';
import { NO_IMAGE_SRC } from '../const';
import { Capitalize } from '../../utils/Capitalize';
import Link from 'next/link';
import { declOfProduct } from '../../utils';

function ManufacturerPageElement({ ManufacturerData }: { ManufacturerData: ManufacturerData[] }): ReactElement {
	return (
		<div className="manufacturer__page__data">
			<PrimaryPageHeader header={'Производители'} />
			<div className="manufacturer__page__data__content">
				{ManufacturerData.sort((m) => (m.image ? -1 : 1)).map((manufacturer) => {
					return (
						<Link
							href={`/catalog/manufacturer/${manufacturer.slug}`}
							className={`manufacturer__page__data__item ${!manufacturer.image ? 'manufacturer__page__data__item__no__image' : ''}`}
							key={`manufacturer__page__data__item__${manufacturer.slug}`}
						>
							{manufacturer.image ? (
								<div className="manufacturer__page__data__item__image__wrapper">
									<Image
										className="manufacturer__page__data__item__image"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.srcset = NO_IMAGE_SRC;
											target.src = NO_IMAGE_SRC;
										}}
										src={`/api${manufacturer.image.path}`}
										alt={manufacturer.name}
										width={80}
										height={80}
										style={{ objectFit: 'contain', maxInlineSize: '100%' }}
									/>
								</div>
							) : null}
							<div className="manufacturer__page__data__item__content">
								<p className="manufacturer__page__data__item__label">{Capitalize(manufacturer.name)}</p>
								<p className="manufacturer__page__data__item__count">
									{manufacturer.productCount} {declOfProduct(manufacturer.productCount)}
								</p>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

export { ManufacturerPageElement };
