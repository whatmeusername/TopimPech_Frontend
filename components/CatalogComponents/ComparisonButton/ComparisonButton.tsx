import { observer } from 'mobx-react-lite';

import { ProductData } from '../Cards/interface';

import Comparison from '../../../public/OptionsIcons/Comparison.svg';
import { useComparinsonProducts } from '../../../context/MobxStoreContext/MobxStoreContext';

// Change to comparison store
const ComparisonButton = observer(({ productData, withLabel }: { productData: ProductData; withLabel: boolean }) => {
	const ComparisonStore = useComparinsonProducts();

	const isSelected = ComparisonStore.has(productData.article);

	return (
		<div
			className={`product__card__option product__card__options__favourite ${
				isSelected ? 'product__card__option__active' : 'product__card__option__inactive'
			}`}
			onClick={() => (isSelected ? ComparisonStore.remove(productData) : ComparisonStore.add(productData))}
		>
			<Comparison className="product__card__option__icon" />
			{withLabel ? <p className="product__card__option__label">{isSelected ? 'В избранном' : 'В избранное'}</p> : null}
		</div>
	);
});

export { ComparisonButton };
