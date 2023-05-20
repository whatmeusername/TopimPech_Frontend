import HeartFilled from '../../../public/OptionsIcons/HeartFilled.svg';
import HeartNotFilled from '../../../public/OptionsIcons/HeartNotFilled.svg';

import { observer } from 'mobx-react-lite';
import { ProductData } from '../Cards/interface';

import { useFavouritesProducts } from '../../../context/MobxStoreContext/MobxStoreContext';

const FavouriteButton = observer(({ productData, withLabel, className }: { productData: ProductData; withLabel?: boolean; className?: string }) => {
	const FavouritesStore = useFavouritesProducts();

	const isSelected = FavouritesStore.has(productData.article);

	return (
		<div
			className={`product__card__option product__card__options__favourite ${className ?? ''} ${
				isSelected ? 'product__card__option__active' : 'product__card__option__inactive'
			}`}
			onClick={() => (isSelected ? FavouritesStore.remove(productData) : FavouritesStore.add(productData))}
		>
			{isSelected ? <HeartFilled className="product__card__option__icon" /> : <HeartNotFilled className="product__card__option__icon" />}
			{withLabel ? <p className="product__card__option__label">{isSelected ? 'В избранном' : 'В избранное'}</p> : null}
		</div>
	);
});

export { FavouriteButton };
