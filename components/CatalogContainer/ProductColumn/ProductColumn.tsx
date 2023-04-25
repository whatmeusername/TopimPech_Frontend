import ProductCardRow from '../../CatalogComponents/Cards/ProductCardRow';
import ProductCardGrid from '../../CatalogComponents/Cards/ProductСardGrid';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import { ProductCardGridSkeleton, ProductCardRowSkeleton } from '../../skeletons/skeletons';
import { CatalogView } from '../ChangeProductView/interface';

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
					if (view === 'grid') return <ProductCardGridSkeleton key={`product__skeleton__${item}`} />;
					else return <ProductCardRowSkeleton key={`product__skeleton__${item}`} />;
				})}
			</>
		);
	} else
		return (
			<>
				{products.map((product) => {
					if (view === 'grid') return <ProductCardGrid product={product} key={product.slug} fadeIn={fadeIn} />;
					else return <ProductCardRow product={product} key={product.slug} fadeIn={fadeIn} />;
				})}
			</>
		);
};

export { ProductColumn };
