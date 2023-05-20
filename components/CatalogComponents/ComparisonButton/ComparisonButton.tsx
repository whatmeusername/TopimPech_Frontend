import { observer } from 'mobx-react-lite';

import { ProductData } from '../Cards/interface';

import ComparisonIcon from '../../../public/OptionsIcons/Comparison.svg';
import { useComparinsonProducts } from '../../../context/MobxStoreContext/MobxStoreContext';
import { FavouritesItem } from '../../../store';

// Change to comparison store
const ComparisonButton = observer(
	({ productData, withLabel, className }: { productData: ProductData | FavouritesItem; withLabel: boolean; className?: string }) => {
		const ComparisonStore = useComparinsonProducts();

		const isSelected = ComparisonStore.has(productData.article);

		return (
			<button
				className={`product__card__option product__card__options__favourite ${className ?? ''} ${
					isSelected ? 'product__card__option__active' : 'product__card__option__inactive'
				}`}
				onClick={() => (isSelected ? ComparisonStore.remove(productData) : ComparisonStore.add(productData))}
			>
				<ComparisonIcon className="product__card__option__icon" />
				{withLabel ? <p className="product__card__option__label">{isSelected ? 'В избранном' : 'В избранное'}</p> : null}
			</button>
		);
	},
);

export { ComparisonButton };
