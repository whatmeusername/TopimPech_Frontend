import { ReactElement, ReactNode } from 'react';

function CatalogHead({ children }: { children: ReactNode[] }): ReactElement {
	return <div className="catalog__head__wrapper">{children}</div>;
}

export { CatalogHead };
