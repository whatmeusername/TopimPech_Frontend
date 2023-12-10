import { ReactElement, useEffect, useRef, useState } from 'react';
import get from 'axios';
import { ProductData } from '../Cards/interface';
import { ModalContentWrapper, ModalHead, ModalWrapper } from '../../CentralModal/CenterModal';
import useToggle from '../../../hooks/useToggle';
import { centerModalControl } from '../../../store';

import { LoadingBar } from '../../Shared/LoadingBar/LoadingBar';
import { LOADING_LABEL_BASE } from '../../Shared/LoadingBar/LoadingLabels';

import { FavouriteButton } from '../FavouriteButton/FavouriteButton';

import './SimilarProductsModal.scss';
import { ComparisonButton } from '../ComparisonButton/ComparisonButton';
import { SimilarIcon } from '../../IconsElements';
import { ProductsGridLayoutItem } from '../../Shared/ProductsGridLayoutItem/ProductsGridLayoutItem';

function SimilarProductsModal({
	ProductData,
	toggle,
	isFetched,
}: {
	ProductData: ProductData[];
	toggle: (fixedState?: boolean | undefined) => void;
	isFetched: boolean;
}): ReactElement {
	const ModalToggle = () => {
		toggle();
		centerModalControl.toggle('SimilarProduct');
	};

	return (
		<ModalWrapper id={'SimilarProduct'} toggle={toggle} contentClassName="similar__center__modal__content__wrapper">
			{isFetched ? (
				<ModalContentWrapper className="similar_product__modal">
					<ModalHead>
						<h3 className="similar_product__modal__content__header">Похожие товары</h3>
					</ModalHead>
					<div className="similar_product__modal__content">
						<div className="similar_product__modal__content__items__wrapper">
							{ProductData.length > 0 ? (
								<>
									<div className="products__grid__layout products__grid__layout__mini">
										{ProductData.map((product) => {
											return <ProductsGridLayoutItem product={product} key={`recomendation__${product.slug}`} onClick={ModalToggle} />;
										})}
									</div>
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

function SimilarProductsElement({ productSlug }: { productSlug: string }): ReactElement {
	const [toggle, setToggle] = useToggle();
	const [products, setProducts] = useState<ProductData[]>(null!);
	const isFetched = useRef<boolean>(false);

	useEffect(() => {
		if (isFetched.current === false && toggle && products === null) {
			get(`/api/products/search/similar/${productSlug}`).then((response) => {
				setProducts(response.data.data);
				isFetched.current = true;
			});
		}
	}, [productSlug, toggle]);

	return (
		<>
			<div
				className="product__card__option product__card__options__similar"
				onClick={() => {
					setToggle();
					centerModalControl.toggle('SimilarProduct');
				}}
			>
				<button className="product__card__option product__card__option__inactive" title="найти похожие товары">
					<SimilarIcon className="product__card__option__icon" />
				</button>
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
			<SimilarProductsElement productSlug={productData.slug} />
		</div>
	);
}

export default ProductCardOptions;
