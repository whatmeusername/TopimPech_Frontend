import { observer } from 'mobx-react-lite';

import { ProductSlider } from '../ProductPage/ProductSlider/ProductSlider';
import { useProductHistory } from '../../context/MobxStoreContext/MobxStoreContext';

const HistorySlider = observer(({ excludeArticle }: { excludeArticle?: string }) => {
	const productHistory = useProductHistory();
	return (
		<ProductSlider
			items={excludeArticle !== undefined ? productHistory.getWithExclude(excludeArticle) : productHistory.items}
			URLStartWith={'/api'}
			key={productHistory.items.length}
		/>
	);
});

export { HistorySlider };
