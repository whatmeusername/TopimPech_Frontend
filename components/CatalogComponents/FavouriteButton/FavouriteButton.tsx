import { observer } from 'mobx-react-lite';
import { ProductData } from '../Cards/interface';

import { useFavouritesProducts } from '../../../context/MobxStoreContext/MobxStoreContext';
import { HeartFilledIcon, HeartNotFilledIcon } from '../../IconsElements';

const FavouriteButton = observer(
	({
		productData,
		withLabel,
		className,
		useBaseStyle,
	}: {
		productData: ProductData;
		withLabel?: boolean;
		className?: string;
		useBaseStyle?: boolean;
	}) => {
		const FavouritesStore = useFavouritesProducts();

		const isSelected = FavouritesStore.has(productData.article);

		return (
			<button
				className={`product__card__option product__card__options__favourite ${className ?? ''} ${
					isSelected ? 'product__card__option__active' : 'product__card__option__inactive'
				} ${useBaseStyle ? 'product__card__option__base' : ''}`}
				onClick={() => (isSelected ? FavouritesStore.remove(productData) : FavouritesStore.add(productData))}
				aria-label={withLabel ? (isSelected ? 'В избранном' : 'В избранное') : undefined}
				aria-pressed={isSelected}
				title={isSelected ? 'В избранном' : 'В избранное'}
			>
				{isSelected ? <HeartFilledIcon className="product__card__option__icon" /> : <HeartNotFilledIcon className="product__card__option__icon" />}
				{withLabel ? <p className="product__card__option__label">{isSelected ? 'В избранном' : 'В избранное'}</p> : null}
			</button>
		);
	},
);

export { FavouriteButton };
