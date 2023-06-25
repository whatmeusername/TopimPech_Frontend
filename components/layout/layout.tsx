'use client';

import { HeaderDesktop, HeaderMobile } from './header/header';
import { Footer } from './footer/footer';
import { ReactElement } from 'react';
import useWindowSize from '../../hooks/useWindowSize';

function Layout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
	const { width } = useWindowSize();

	return (
		<>
			{width && width <= 768 ? <HeaderMobile /> : <HeaderDesktop />}
			{children}
			<Footer />
		</>
	);
}

export default Layout;
