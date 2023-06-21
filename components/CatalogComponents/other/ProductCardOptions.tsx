import { ReactElement, useEffect, useRef, useState } from 'react';
import get from 'axios';
import { ProductData } from '../Cards/interface';
import { ModalContentWrapper, ModalHead, ModalWrapper } from '../../CentralModal/CenterModal';
import useToggle from '../../../hooks/useToggle';
import { centerModalControl } from '../../../store';
import { ProductSlider } from '../../ProductPage/ProductSlider/ProductSlider';
import { LoadingBar } from '../../Shared/LoadingBar/LoadingBar';
import { LOADING_LABEL_BASE } from '../../Shared/LoadingBar/LoadingLabels';

import { FavouriteButton } from '../FavouriteButton/FavouriteButton';

import SimilarIcon from '../../../public/OptionsIcons/Similar.svg';

import './SimilarProductsModal.scss';
import { ComparisonButton } from '../ComparisonButton/ComparisonButton';

function SimilarProductsModal({
	ProductData,
	toggle,
	isFetched,
}: {
	ProductData: ProductData[];
	toggle: (fixedState?: boolean | undefined) => void;
	isFetched: boolean;
}): ReactElement {
	return (
		<ModalWrapper id={'SimilarProduct'} toggle={toggle}>
			{isFetched ? (
				<ModalContentWrapper className="similar_product__modal">
					<ModalHead />
					<div className="modal__content similar_product__modal">
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
					</div>
				</ModalContentWrapper>
			) : (
				<LoadingBar label={LOADING_LABEL_BASE} />
			)}
		</ModalWrapper>
	);
}

function SimilarProductsElement({ article }: { article: string }): ReactElement {
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
				title="найти похожие товары"
			>
				<SimilarIcon className="product__card__option__icon" />
			</div>
			{toggle ? <SimilarProductsModal ProductData={products ?? []} toggle={setToggle} isFetched={isFetched.current} /> : null}
		</>
	);
}

function ProductCardOptions({ productData }: { productData: ProductData }): ReactElement {
	return (
		<div className="product__card__options__wrapper">
			<div className="product__card__option product__card__options__favourite">
				<FavouriteButton productData={productData} />
			</div>
			<div className="product__card__option product__card__options__comparison">
				<ComparisonButton productData={productData} />
			</div>
			<SimilarProductsElement article={productData.article} />
		</div>
	);
}

export default ProductCardOptions;
