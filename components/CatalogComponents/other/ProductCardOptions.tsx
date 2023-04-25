import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';

function SimilarProductsElement() {
	const [active, setActive] = useState<boolean>(false);
	return (
		<>
			<div
				className={`product__card__option ${
					active ? 'product__card__option__active' : 'product__card__option__inactive'
				} product__card__options__favourite`}
				onClick={(e) => setActive(!active)}
			>
				<FontAwesomeIcon icon={faEquals} />
			</div>
		</>
	);
}

function ProductCardOptions(): JSX.Element {
	return (
		<div className="product__card__options__wrapper">
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faHeart} />
			</div>
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faChartColumn} />
			</div>
			<SimilarProductsElement />
		</div>
	);
}

export default ProductCardOptions;
