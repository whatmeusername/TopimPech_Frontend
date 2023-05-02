enum CatalogView {
	GRID = 'grid',
	ROW = 'row',
}

interface ProductAligmentVariantData {
	icon: JSX.Element;
	name: CatalogView;
}

export { CatalogView };
export type { ProductAligmentVariantData };
