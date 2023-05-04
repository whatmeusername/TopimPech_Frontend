import { ReactNode, ReactElement } from 'react';

import './CatalogContainerFooter.scss';

const CatalogContainerFooter = ({ children }: { children: ReactNode[] | ReactNode }): ReactElement => {
	return <div className="catalog__footer">{children}</div>;
};

export { CatalogContainerFooter };
