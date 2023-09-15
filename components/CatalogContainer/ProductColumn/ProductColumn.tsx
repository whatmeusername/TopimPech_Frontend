'use client';

import ProductCardRow from '../../CatalogComponents/Cards/Row/ProductCardRow';
import ProductCardGrid from '../../CatalogComponents/Cards/Grid/ProductСardGrid';
import { ProductData } from '../../CatalogComponents/Cards/interface';

import { CatalogView } from '../ChangeProductView/interface';

import { ThinBreakLine } from '../../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { Fragment } from 'react';
import { NoProductsFoundForFilter } from '../NoProductsFoundForFilter/NoProductsFoundForFilter';

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
		return <NoProductsFoundForFilter />;
	} else
		return (
			<div className={`catalog__products__container ${view === 'grid' ? 'display__row' : 'display__column'}`}>
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
			</div>
		);
};

export { ProductColumn };
