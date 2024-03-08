import Link from 'next/link';
import { useMobileContext } from '../../../context/MobileContext/MobileContext';
import Slider from '../../Shared/Slider';
import { NO_IMAGE_SRC } from '../../const';
import Image from 'next/image';
import './BannersSlider.scss';

const banners = [
	{
		desktop: '/api/images/banners/TopimPechBanner01Desktop.png',
		mobile: '/api/images/banners/TopimPechBanner01Mobile.png',
		url: '/catalog/drovyanye-pechi-vezuvij-legenda-russkij-par',
	},
	{
		desktop: '/api/images/banners/TopimPechBanner02Desktop.png',
		mobile: '/api/images/banners/TopimPechBanner02Mobile.png',
		url: '/catalog/pechi-kaminy-everest',
	},
	{
		desktop: '/api/images/banners/TopimPechBanner03Desktop.png',
		mobile: '/api/images/banners/TopimPechBanner03Mobile.png',
		url: '/catalog/drovyannye-pechi-aston',
	},
];

function BannersSlider() {
	const isMobile = useMobileContext();
	return (
		<div className="home__page__banners__wrapper home__width__limiter">
			<Slider
				SliderSettings={{
					ItemsPerSlide: 1,
					returnToOtherSide: true,
					auto: { timeMS: 5000 },
					disableMobileVersion: true,
					buttons: { disableWhen: 768, enabled: !isMobile },
				}}
			>
				{banners.map((banner, i) => {
					return (
						<Slider.Item key={`home__page__banner__${i}`} className="home__page__banner__item">
							<div>
								<Link href={banner.url} className="home__page__banner__link">
									<Image
										src={isMobile ? banner.mobile : banner.desktop}
										className="home__page__banner__image"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.srcset = NO_IMAGE_SRC;
											target.src = NO_IMAGE_SRC;
										}}
										alt={banner.url}
										width={isMobile ? 720 : 1440}
										height={isMobile ? 420 : 400}
										style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
									/>
								</Link>
							</div>
						</Slider.Item>
					);
				})}
			</Slider>
		</div>
	);
}

export { BannersSlider };
