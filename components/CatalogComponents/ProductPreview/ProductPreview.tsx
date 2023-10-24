import { observer } from 'mobx-react-lite';
import useToggle from '../../../hooks/useToggle';

import { centerModalControl } from '../../../store';
import { ModalContentWrapper, ModalHead, ModalWrapper } from '../../CentralModal/CenterModal';
import './ProductPreview.scss';
import { ProductData } from '../Cards/interface';
import AddToCartButton from '../AddToCartButton/AddToCartButton';
import { FavouriteButton } from '../FavouriteButton/FavouriteButton';
import { ComparisonButton } from '../ComparisonButton/ComparisonButton';
import Link from 'next/link';

import { ShortAttributesElement } from '../../ProductPage/AttributesElement/AttributesElement';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { ArrowGallery } from '../../Shared/ArrowGallery/ArrowGallery';

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
							<AddToCartButton product={productData} />
							<FavouriteButton productData={productData} withLabel={true} useBaseStyle />
							<ComparisonButton productData={productData} withLabel={true} useBaseStyle />
						</div>
						<ShortAttributesElement properties={productData.properties ?? []} showAllBtn={false} take={7} />
						<Link
							className="product__preview__link"
							href={`/product/${productData.slug}`}
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
	const isMobile = useMobile(768);
	const [toggle, setToggle] = useToggle();

	if (isMobile) return null;
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
	const isMobile = useMobile(768);

	if (isMobile) return null;

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
