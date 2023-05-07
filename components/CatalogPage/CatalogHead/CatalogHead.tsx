import { ReactElement, ReactNode } from 'react';

import './CatalogHead.scss';

function CatalogHead({ children }: { children: ReactNode | ReactNode[] }): ReactElement {
	return <div className="catalog__head__wrapper">{children}</div>;
}

export { CatalogHead };
