import { observer } from 'mobx-react-lite';

import { ProductData } from '../Cards/interface';

import { useComparinsonProducts } from '../../../context/MobxStoreContext/MobxStoreContext';
import { FavouritesItem } from '../../../store';
import { ComparisonIcon } from '../../IconsElements';

// Change to comparison store
const ComparisonButton = observer(
	({
		productData,
		withLabel,
		className,
		useBaseStyle,
	}: {
		productData: ProductData | FavouritesItem;
		withLabel?: boolean;
		className?: string;
		useBaseStyle?: boolean;
	}) => {
		const ComparisonStore = useComparinsonProducts();

		const isSelected = ComparisonStore.has(productData.id);

		return (
			<button
				className={`product__card__option product__card__options__favourite ${className ?? ''} ${
					isSelected ? 'product__card__option__active' : 'product__card__option__inactive'
				} ${useBaseStyle ? 'product__card__option__base' : ''}`}
				onClick={() => (isSelected ? ComparisonStore.remove(productData) : ComparisonStore.add(productData))}
				aria-label={withLabel ? (isSelected ? 'В сравнение' : 'Сравнить') : undefined}
				title={isSelected ? 'В сравнение' : 'Сравнить'}
			>
				<ComparisonIcon className="product__card__option__icon" />
				{withLabel ? <p className="product__card__option__label">{isSelected ? 'В сравнение' : 'Сравнить'}</p> : null}
			</button>
		);
	},
);

export { ComparisonButton };
