import { ReactNode, ReactElement } from 'react';

const CatalogContainerFooter = ({ children }: { children: ReactNode[] | ReactNode }): ReactElement => {
	return <div className="catalog__footer">{children}</div>;
};

export { CatalogContainerFooter };
