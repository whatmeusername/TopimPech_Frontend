import { observer } from 'mobx-react-lite';
import { useState, useEffect } from 'react';
import { favouritesProducts } from '../../../store/favourites';
import { ProductData } from '../Cards/interface';

import Comparison from '../../../public/OptionsIcons/Comparison.svg';

// Change to comparison store
const ComparisonButton = observer(({ productData, withLabel }: { productData: ProductData; withLabel: boolean }) => {
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
			<Comparison className="product__card__option__icon" />
			{withLabel ? <p className="product__card__option__label">{isSelected ? 'В избранном' : 'В избранное'}</p> : null}
		</div>
	);
});

export { ComparisonButton };
