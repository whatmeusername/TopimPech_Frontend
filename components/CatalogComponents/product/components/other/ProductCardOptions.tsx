import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEquals, faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';

function ProductCardOptions(): JSX.Element {
	return (
		<div className="product__card__options__wrapper">
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faHeart} />
			</div>
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faChartColumn} />
			</div>
			<div className="product__card__option product__card__options__favourite">
				<FontAwesomeIcon icon={faEquals} />
			</div>
		</div>
	);
}

export default ProductCardOptions;
