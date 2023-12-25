'use client';

import { PrimaryPageHeader } from '../../Shared/PrimaryPageHeader/PrimaryPageHeader';
import type { OurWorksData } from '../../HomePageElement/interface';
import './MontagePageElement.scss';

const Steps = [
	{
		header: 'Выезд на замер',
		text: 'Специалист оценит или предложит место под расположение вашей печи или камина, а также снимет размеры. Обсудит ваши запросы, а также запишет технические детали.',
	},
	{
		header: 'Согласование сметы',
		text: 'Специалист подготовит смету. Составит список необходимого оборудования и материала. Бюджет на работу будет зафиксирован и не изменится в будущем.',
	},
	{
		header: 'Доставка товара',
		text: 'Доставим к вам ваш заказ. Возьмем на себя выгрузку и занос оборудования и материала в помещение.',
	},
	{
		header: 'Гарантийное обслуживание',
		text: 'Мы предоставляем гарантию на монтажные работы.',
	},
];

function MontagePageElemenent({ OurWorks }: { OurWorks: OurWorksData[] }) {
	const MainText =
		'Мы считаем, что бы банные печи и камины прослужили как можно больше, а также для получения гарантированной безопасности и качества, необходимо обращаться к профессионалам. Поэтому наш интернет-магазин предоставляет услуги замера и монтажа отопительного оборудования, мы также рекомендуем проверенные специализированные монтажные бригады, обладающие всеми необходимыми документами потверждающии их надежность, а также большим опытом работы в области монтажа отопительных систем. ';

	return (
		<div className="montage__page__wrapper">
			<PrimaryPageHeader header={'Монтаж и установка'} />
			<div className="montage__page__main__text__wrapper">
				<h2 className="montage__page__main__header">Пару слов об услуге:</h2>
				<p className="montage__page__main__text">{MainText}</p>
			</div>
			<div className="montage__page__content__wrapper">
				<div className="montage__page__steps__wrapper">
					<div className="montage__page__block__header__wrapper">
						<span className="montage__page__line" />
						<h2 className="montage__page__block__header">Этапы работ</h2>
						<span className="montage__page__line" />
					</div>
				</div>
				<div className="montage__page__timeline">
					{Steps.map((step, i) => {
						return (
							<div
								className={`timeline__container ${i % 2 === 0 ? 'right' : 'left'}`}
								key={`montage__page__content__timeline__item__${i}`}
								data-container-index={i + 1}
							>
								<div className="timeline__content">
									<h3 className="content__header">{step.header}</h3>
									<p className="content__text">{step.text}</p>
								</div>
							</div>
						);
					})}
				</div>
				<div className="montage__page__examples__wrapper">
					<div className="montage__page__block__header__wrapper">
						<span className="montage__page__line" />
						<h2 className="montage__page__block__header">Примеры работы</h2>
						<span className="montage__page__line" />
					</div>
					<div className="montage__page__examples__content">
						{OurWorks.map((img) => {
							return (
								<div className="montage__page__item__wrapper" key={`montage__page__work__${img.name}`}>
									<img src={`/api${img.path}`} className="montage__page__examples__item" />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export { MontagePageElemenent };
