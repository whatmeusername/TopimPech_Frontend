import { observer } from 'mobx-react-lite';
import { productHistory } from '../../store';
import { ProductSlider } from '../ProductPage/ProductSlider/ProductSlider';

const HistorySlider = observer(({ excludeArticle }: { excludeArticle?: string }) => {
	return (
		<ProductSlider
			items={excludeArticle !== undefined ? productHistory.getWithExclude(excludeArticle) : productHistory.items}
			URLStartWith={'/api'}
			key={productHistory.items.length}
		/>
	);
});

export { HistorySlider };
