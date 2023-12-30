import Link from 'next/link';
import { ReactElement } from 'react';
import { Capitalize } from '../../../utils/Capitalize';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import type { ManufacturerData } from '../interface';
import Slider from '../../Shared/Slider';
import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import './ManufacturesBlock.scss';

function ManufacturesBlock({ ManufacturerData }: { ManufacturerData: ManufacturerData[] }): ReactElement {
	return (
		<div className="home__page__manufacturer__block">
			<div className="home__page__manufacturer__content home__width__limiter">
				<div className="home__page__manufacturer__header__wrapper">
					<h2 className="home__page__manufacturer__header">Производители</h2>
				</div>
				<Slider SliderSettings={{ ItemsPerSlide: 'auto', auto: { timeMS: 5000 }, returnToOtherSide: true }}>
					{ManufacturerData.sort((m) => (m.image ? -1 : 1)).map((manufacturer) => {
						return (
							<Slider.Item className="home__page__manufacturer__item" key={`home__page__manufacturer__item__${manufacturer.slug}`}>
								<Link href={`/catalog/manufacturer/${manufacturer.slug}`} className="home__page__manufacturer__item__content">
									{manufacturer.image ? (
										<div className="home__page__manufacturer__item__image__wrapper">
											<Image
												className="home__page__manufacturer__item__image"
												onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
												src={`/api${manufacturer.image.path}`}
												alt={manufacturer.name}
												width={160}
												height={160}
												style={{ objectFit: 'contain', maxInlineSize: '100%' }}
											/>
										</div>
									) : (
										<p className="home__page__manufacturer__item__label">{Capitalize(manufacturer.name)}</p>
									)}
								</Link>
							</Slider.Item>
						);
					})}
				</Slider>
				<ThinBreakLine />
			</div>
		</div>
	);
}

export { ManufacturesBlock };
