import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals, faChartColumn, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { ReactElement, useEffect, useRef, useState } from 'react';
import get from 'axios';
import { ProductData } from '../Cards/interface';
import { createPortal } from 'react-dom';
import { ModalWrapper } from '../../CentralModal/CenterModal';
import useToggle from '../../../hooks/useToggle';
import { centerModalControl } from '../../../store';
import './SimilarProductsModal.scss';
import { ProductSlider } from '../../ProductPage/ProductSlider/ProductSlider';
import { LoadingBar } from '../../Shared/LoadingBar/LoadingBar';
import { LOADING_LABEL_BASE } from '../../Shared/LoadingBar/LoadingLabels';
import { observer } from 'mobx-react-lite';

import HeartFilled from '../../../public/HeaderOtionsIcons/HeartFilled.svg';
import HeartNotFilled from '../../../public/HeaderOtionsIcons/HeartNotFilled.svg';
import { favouritesProducts } from '../../../store/favourites';

function SimilarProductsModal({
	ProductData,
	toggle,
	isFetched,
}: {
	ProductData: ProductData[];
	toggle: (fixedState?: boolean | undefined) => void;
	isFetched: boolean;
}): ReactElement {
	return createPortal(
		<ModalWrapper id={'SimilarProduct'} toggle={toggle}>
			{isFetched ? (
				<div className="modal__content similar_product__modal">
					<div className="similar_product__modal__header">
						<div className="similar_product__modal__close__wrapper">
							<button
								className="modal__close__wrapper__button"
								onClick={() => {
									toggle();
									centerModalControl.toggle('SimilarProduct');
								}}
							>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</div>
					</div>
					<hr className="break__line__standard"></hr>
					<div className="similar_product__modal__content__items__wrapper">
						{ProductData.length > 0 ? (
							<>
								<h3 className="similar_product__modal__content__header">Похожие товары</h3>
								<ProductSlider items={ProductData} URLStartWith="/api" />
							</>
						) : (
							<p className="similar_product__not__found">Упс! К сожалению мы не нашли похожих товаров</p>
						)}
					</div>
					<div className="similar_product__modal__footer__items"></div>
				</div>
			) : (
				<LoadingBar label={LOADING_LABEL_BASE} />
			)}
		</ModalWrapper>,
		document.body,
	);
}

function SimilarProductsElement({ article }: { article: number }): ReactElement {
	const [toggle, setToggle] = useToggle();
	const [products, setProducts] = useState<ProductData[]>(null!);
	const isFetched = useRef<boolean>(false);

	useEffect(() => {
		if (isFetched.current === false && toggle && products === null) {
			get(`/api/products/similar/${article}`).then((response) => {
				setProducts(response.data.data);
				isFetched.current = true;
			});
		}
	}, [article, toggle]);

	return (
		<>
			<div
				className="product__card__option product__card__options__similar"
				onClick={() => {
					setToggle();
					centerModalControl.toggle('SimilarProduct');
				}}
			>
				<FontAwesomeIcon icon={faEquals} />
			</div>
			{toggle ? <SimilarProductsModal ProductData={products ?? []} toggle={setToggle} isFetched={isFetched.current} /> : null}
		</>
	);
}

const FavouriteProductsElement = observer(({ productData }: { productData: ProductData }) => {
	const [isSelected, setSelected] = useState<boolean>(false);

	useEffect(() => {
		setSelected(favouritesProducts.has(productData.article));
	}, [favouritesProducts.has(productData.article)]);

	return (
		<div
			className={`product__card__option product__card__options__favourite ${
				isSelected ? 'product__card__option__active' : 'product__card__option__inactive'
			}`}
			onClick={() => (isSelected ? favouritesProducts.remove(productData) : favouritesProducts.add(productData))}
		>
			{isSelected ? <HeartFilled className="product__card__option__icon" /> : <HeartNotFilled className="product__card__option__icon" />}
		</div>
	);
});

function ProductCardOptions({ productData }: { productData: ProductData }): ReactElement {
	return (
		<div className="product__card__options__wrapper">
			<div className="product__card__option product__card__options__favourite">
				<FavouriteProductsElement productData={productData} />
			</div>
			<div className="product__card__option product__card__options__comparison">
				<FontAwesomeIcon icon={faChartColumn} />
			</div>
			<SimilarProductsElement article={productData.article} />
		</div>
	);
}

export default ProductCardOptions;
