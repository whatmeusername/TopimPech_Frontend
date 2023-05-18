import { useEffect, useState } from 'react';

import HeartFilled from '../../../public/OptionsIcons/HeartFilled.svg';
import HeartNotFilled from '../../../public/OptionsIcons/HeartNotFilled.svg';

import { observer } from 'mobx-react-lite';
import { ProductData } from '../Cards/interface';
import { favouritesProducts } from '../../../store/favourites';

const FavouriteButton = observer(({ productData, withLabel }: { productData: ProductData; withLabel?: boolean }) => {
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
			{withLabel ? <p className="product__card__option__label">{isSelected ? 'В избранном' : 'В избранное'}</p> : null}
		</div>
	);
});

export { FavouriteButton };
