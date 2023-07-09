enum CatalogView {
	GRID = 'grid',
	ROW = 'row',
}

const CATALOG_VIEW_COOKIE = 'catalog_view';

interface ProductAligmentVariantData {
	icon: JSX.Element;
	name: CatalogView;
}

export { CatalogView, CATALOG_VIEW_COOKIE };
export type { ProductAligmentVariantData };
