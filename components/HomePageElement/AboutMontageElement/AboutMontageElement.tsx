import Link from 'next/link';
import { ReactElement } from 'react';
import { SettingsIcon, PriceTagIcon, InsuranceIcon } from '../../IconsElements';
import type { OurWorksData } from '../interface';
import Image from 'next/image';
import { NO_IMAGE_SRC } from '../../const';
import './AboutMontageElement.scss';

function AboutMontageElement({ OurWorksData }: { OurWorksData: OurWorksData[] }): ReactElement {
	const MontageBlock = [
		{
			icon: <SettingsIcon className="home__page__montage__item__icon" />,
			header: 'Надежность',
			text: 'Монтажники имеют большой опыт, поэтому вы можете быть уверены в надежности установленных конструкций.',
		},
		{
			icon: <PriceTagIcon className="home__page__montage__item__icon" />,
			header: 'Одна цена',
			text: 'Список необходимых материалов, а также необходимые работы обговариваются заранее и прописываются в смете. Поэтому цены на работы будут неизменны.',
		},
		{
			icon: <InsuranceIcon className="home__page__montage__item__icon" />,
			header: 'Гарантия качества',
			text: 'В течении гарантийного срока неисправности будут устранены силами.',
		},
	];

	return (
		<div className="home__page__montage__wrapper">
			<div className="home__page__montage__content home__width__limiter">
				<div className="home__page__montage__wrapper__images">
					{OurWorksData.slice(0, 16).map((img) => {
						return (
							<div className="home__page__montage__item__wrapper" key={`montage__page__work__${img.name}`}>
								<Image
									className="home__page__montage__item"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.srcset = NO_IMAGE_SRC;
										target.src = NO_IMAGE_SRC;
									}}
									src={`/api${img.path}`}
									alt={`примеры работы ${img.name}`}
									width={220}
									height={220}
									style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
								/>
							</div>
						);
					})}
				</div>
				<div className="home__page__montage__info__wrapper">
					<h2 className="home__page__montage__header">Монтаж и установка банных печей и каминов</h2>
					<div className="home__page__montage__info__items">
						{MontageBlock.map((item, i) => {
							return (
								<div className="home__page__montage__item__wrapper" key={`home__page__montage__item__wrapper__${i}`}>
									<div className="home__page__montage__item__icon__wrapper">{item.icon}</div>
									<div className="home__page__montage__item__info">
										<h3 className="home__page__montage__item__header">{item.header}</h3>
										<p className="home__page__montage__item__text">{item.text}</p>
									</div>
								</div>
							);
						})}
					</div>
					<div className="home__page__montage__link__wrapper">
						<Link href={'/info/montage'} className="home__page__montage__link">
							Подробнее об услуге
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

export { AboutMontageElement };
