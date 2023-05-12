import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals, faChartColumn, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { ReactElement, useEffect, useState } from 'react';
import get from 'axios';
import { ProductData } from '../Cards/interface';
import { createPortal } from 'react-dom';
import { ModalWrapper } from '../../CentralModal/CenterModal';
import useToggle from '../../../hooks/useToggle';
import { centerModalControl } from '../../../store';
import './SimilarProductsModal.scss';
import { ProductSlider } from '../../ProductPage/ProductSlider/ProductSlider';

function SimilarProductsModal({
	ProductData,
	toggle,
}: {
	ProductData: ProductData[];
	toggle: (fixedState?: boolean | undefined) => void;
}): ReactElement {
	return createPortal(
		<ModalWrapper id={'SimilarProduct'} toggle={toggle}>
			<div className="modal__content similar__product__modal">
				<div className="similar__product__modal__header">
					<div className="similar__product__modal__close__wrapper">
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
				<div className="filter__modal__content__items__wrapper">
					<ProductSlider items={ProductData} URLStartWith="/api" />
				</div>
				<div className="filter__modal__footer__items"></div>
			</div>
		</ModalWrapper>,
		document.body,
	);
}

function SimilarProductsElement({ article }: { article: number }): ReactElement {
	const [toggle, setToggle] = useToggle();
	const [products, setProducts] = useState<ProductData[]>(null!);

	useEffect(() => {
		if (toggle && products === null) {
			get(`/api/products/similar/${article}`).then((response) => {
				setProducts(response.data.data);
			});
		}
	}, [article, toggle]);

	return (
		<>
			<div
				className="product__card__option product__card__options__favourite"
				onClick={() => {
					setToggle();
					centerModalControl.toggle('SimilarProduct');
				}}
			>
				<FontAwesomeIcon icon={faEquals} />
			</div>
			{toggle ? <SimilarProductsModal ProductData={products ?? []} toggle={setToggle} /> : null}
		</>
	);
}

function ProductCardOptions({ article }: { article: number }): ReactElement {
	return (
		<div className="product__card__options__wrapper">
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faHeart} />
			</div>
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faChartColumn} />
			</div>
			<SimilarProductsElement article={article} />
		</div>
	);
}

export default ProductCardOptions;
