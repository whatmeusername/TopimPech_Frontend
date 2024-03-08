import { useState, useRef, useEffect } from 'react';

import { AngleArrowIcon } from '../../IconsElements';
import { NO_IMAGE_SRC } from '../../const';
import './ArrowGallery.scss';

import Image from 'next/image';
import { BaseImage } from '../../CatalogComponents/Cards/interface';

function ArrowGallery({ items, urlStartsWith }: { items: BaseImage[]; urlStartsWith?: string }) {
	const [selectedItem, setSelectedItem] = useState<number>(0);
	const sliderItemWidth = useRef<number>(0);
	const sliderItemsRef = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		sliderItemWidth.current = (sliderItemsRef.current.firstChild as HTMLSpanElement)?.offsetWidth ?? 0;
	}, []);

	const isLeftBTNActive = selectedItem > 0;
	const isRightBTNActive = selectedItem + 1 < items.length;

	return (
		<div className="arrow__gallery__wrapper">
			<div className="arrow__gallery__content" ref={sliderItemsRef} style={{ left: `-${sliderItemWidth.current * selectedItem}px` }}>
				{items.map((image) => {
					return (
						<span className="arrow__gallery__image__wrapper" key={image.name}>
							<Image
								key={image.name}
								className="child__category__image"
								src={`${urlStartsWith ?? ''}${image.path}`}
								alt={image.name}
								loading="lazy"
								width={500}
								height={500}
								style={{ objectFit: 'contain', maxInlineSize: '100%' }}
								onError={(e) => {
									const target = e.target as HTMLImageElement;
									target.srcset = NO_IMAGE_SRC;
									target.src = NO_IMAGE_SRC;
								}}
							/>
						</span>
					);
				})}
			</div>
			{items.length > 1 ? (
				<>
					<button
						className={`arrow__gallery__btn arrow__gallery__btn__left ${
							isLeftBTNActive ? 'arrow__gallery__btn__active' : 'arrow__gallery__btn__inactive'
						}`}
						onClick={isLeftBTNActive ? () => setSelectedItem(selectedItem - 1) : undefined}
						title={isLeftBTNActive ? 'показать предыдущий слайд' : undefined}
						aria-label={isLeftBTNActive ? 'показать предыдущий слайд' : undefined}
						disabled={selectedItem <= 0}
					>
						<AngleArrowIcon className="arrow__gallery__arrow__icon" />
					</button>
					<button
						className={`arrow__gallery__btn arrow__gallery__btn__right ${
							isRightBTNActive ? 'arrow__gallery__btn__active' : 'arrow__gallery__btn__inactive'
						}`}
						onClick={isRightBTNActive ? () => setSelectedItem(selectedItem + 1) : undefined}
						title={isRightBTNActive ? 'показать следущий слайд' : undefined}
						aria-label={isRightBTNActive ? 'показать следущий слайд' : undefined}
						disabled={selectedItem + 1 > items.length}
					>
						<AngleArrowIcon className="arrow__gallery__arrow__icon" />
					</button>
					<div className="tabs__wrapper">
						{items.map((tab, i) => {
							return <span className={`tab__item ${i === selectedItem ? 'tab__item__active' : ''}`} key={tab.name} />;
						})}
					</div>
				</>
			) : null}
		</div>
	);
}

export { ArrowGallery };
