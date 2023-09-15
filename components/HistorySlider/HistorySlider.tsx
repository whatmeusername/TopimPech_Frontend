import { observer } from 'mobx-react-lite';

import { ProductSlider } from '../ProductPage/ProductSlider/ProductSlider';
import { useProductHistory } from '../../context/MobxStoreContext/MobxStoreContext';

import './HistorySlider.scss';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';

const HistorySlider = observer(
	({ excludeArticle, includeHeader, className }: { excludeArticle?: string; includeHeader?: boolean; className?: string }) => {
		const productHistory = useProductHistory();
		if (productHistory.items.length === 0) return null;
		else if (includeHeader) {
			return (
				<div className={`product__history__slider__wrapper ${className}`}>
					<ThinBreakLine />
					<h2 className="product__history__slider__header">Вы смотрели ранее</h2>
					<ProductSlider
						items={excludeArticle !== undefined ? productHistory.getWithExclude(excludeArticle) : productHistory.items}
						URLStartWith={'/api'}
						key={productHistory.items.length}
					/>
				</div>
			);
		} else {
			return (
				<ProductSlider
					items={excludeArticle !== undefined ? productHistory.getWithExclude(excludeArticle) : productHistory.items}
					URLStartWith={'/api'}
					key={productHistory.items.length}
				/>
			);
		}
	},
);

export { HistorySlider };
