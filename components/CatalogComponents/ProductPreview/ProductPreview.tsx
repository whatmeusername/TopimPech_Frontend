import { observer } from 'mobx-react-lite';
import useToggle from '../../../hooks/useToggle';
import useWindowSize from '../../../hooks/useWindowSize';
import { centerModalControl } from '../../../store';
import { ModalContentWrapper, ModalHead, ModalWrapper } from '../../CentralModal/CenterModal';
import './ProductPreview.scss';
import { ProductData, ProductImage } from '../Cards/interface';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import { FavouriteButton } from '../FavouriteButton/FavouriteButton';
import { ComparisonButton } from '../ComparisonButton/ComparisonButton';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { ShortAttributesElement } from '../../ProductPage/AttributesElement/AttributesElement';
import { AngleArrowIcon } from '../../IconsElements';

function ArrowGallery({ items, urlStartsWith }: { items: ProductImage[]; urlStartsWith?: string }) {
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
							<img src={`${urlStartsWith ?? ''}${image.path}`} alt={image.name} className="arrow__gallery__image" key={image.name} />
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

function ProductPreviewModal({ id, toggle, productData }: { id: string; toggle: any; productData: ProductData }) {
	return (
		<ModalWrapper id={id} toggle={toggle}>
			<ModalContentWrapper className="product__preview__modal">
				<ModalHead>
					<p className="modal__header">{productData.name}</p>
					<p className="modal__header__article">Артикул {productData.article}</p>
				</ModalHead>
				<div className="modal__content__wrapper">
					<div className="modal__content__gallery modal__content__block">
						<ArrowGallery items={productData.images} urlStartsWith="/api" />
					</div>
					<div className="modal__content__info modal__content__block">
						<div className="modal__content__info__options">
							<AddToCartButton article={productData.article} />
							<FavouriteButton productData={productData} withLabel={true} useBaseStyle />
							<ComparisonButton productData={productData} withLabel={true} useBaseStyle />
						</div>
						<ShortAttributesElement properties={productData.properties ?? []} showAllBtn={false} take={7} />
						<Link
							className="product__preview__link"
							href={`/product/${productData.article}`}
							onClick={() => {
								if (toggle) toggle();
								centerModalControl.toggle(id);
							}}
						>
							Перейти на страницу товара
						</Link>
					</div>
				</div>
			</ModalContentWrapper>
		</ModalWrapper>
	);
}

const ProductPreview = observer(({ productData }: { productData: ProductData }) => {
	const { width } = useWindowSize();
	const [toggle, setToggle] = useToggle();

	if (width && width <= 768) return null;
	const id = 'ProductPreview';

	return (
		<>
			<button
				className="product__preview"
				onClick={(e: React.MouseEvent) => {
					e.preventDefault();
					e.stopPropagation();
					centerModalControl.toggle(id);
					setToggle(true);
				}}
				aria-pressed={toggle}
			>
				Предпросмотр
			</button>
			{toggle ? <ProductPreviewModal id={id} toggle={setToggle} productData={productData} /> : null}
		</>
	);
});

const ProductPreviewBTN = observer(({ setToggle }: { setToggle: (fixedState?: boolean | undefined) => void }) => {
	const { width } = useWindowSize();

	if (width && width <= 768) return null;

	return (
		<>
			<button
				className="product__preview"
				onClick={(e: React.MouseEvent) => {
					e.preventDefault();
					e.stopPropagation();
					centerModalControl.toggle('ProductPreview');
					setToggle(true);
				}}
			>
				Предпросмотр
			</button>
		</>
	);
});

export { ProductPreviewBTN, ProductPreview, ProductPreviewModal };
