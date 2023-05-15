import { ReactElement } from 'react';
import './CatalogContainerFooter.scss';

function CatalogContainerFooter({ children }: { children: ReactElement | ReactElement[] }) {
	return <div className="catalog__container__wrapper">{children}</div>;
}

export { CatalogContainerFooter };
