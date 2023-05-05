import ProductCardRow from '../../CatalogComponents/Cards/Row/ProductCardRow';
import ProductCardGrid from '../../CatalogComponents/Cards/Grid/ProductСardGrid';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import { ProductCardGridSkeleton, ProductCardRowSkeleton } from '../../skeletons/skeletons';
import { CatalogView } from '../ChangeProductView/interface';

import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { Fragment } from 'react';

const ProductColumn = ({
	products,
	view = CatalogView.ROW,
	fadeIn = false,
}: {
	products: ProductData[];
	view: string;
	fadeIn: boolean;
}): JSX.Element => {
	if (products.length === 0) {
		return (
			<>
				{Array.from(Array(24).keys()).map((item) => {
					if (view === CatalogView.GRID) return <ProductCardGridSkeleton key={`product__skeleton__${item}`} />;
					else return <ProductCardRowSkeleton key={`product__skeleton__${item}`} />;
				})}
			</>
		);
	} else
		return (
			<>
				{products.map((product, i) => {
					if (view === CatalogView.GRID) return <ProductCardGrid product={product} key={product.slug} fadeIn={fadeIn} />;
					else
						return (
							<Fragment key={product.slug}>
								<ProductCardRow product={product} fadeIn={fadeIn} />
								{products.length - 1 !== i ? <ThinBreakLine /> : null}
							</Fragment>
						);
				})}
			</>
		);
};

export { ProductColumn };
