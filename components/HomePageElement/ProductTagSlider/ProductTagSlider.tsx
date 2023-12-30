import { ReactElement } from 'react';
import { Capitalize } from '../../../utils/Capitalize';
import { ProductTag } from '../../CatalogComponents/Cards/interface';
import { ProductSlider } from '../../ProductPage/ProductSlider/ProductSlider';
import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import './ProductTagSlider.scss';

function ProductTagSlider({ ProductTagData }: { ProductTagData: Required<ProductTag> }): ReactElement {
	return (
		<div className="home__page__product__tag__slider__wrapper home__width__limiter">
			<div className="home__page__product__tag__slider__header__wrapper">
				<h2 className="home__page__product__tag__slider__header">{Capitalize(ProductTagData.name)}</h2>
			</div>
			<ProductSlider items={ProductTagData.product} URLStartWith={'/api'} />
			<ThinBreakLine />
		</div>
	);
}

export { ProductTagSlider };
