'use client';

import { HeaderDesktop, HeaderMobile } from './header/header';
import { Footer } from './footer/footer';
import { ReactElement } from 'react';
import { useMobile } from '../../context/MobileContext/MobileContext';

function Layout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
	const isMobile = useMobile(768);

	return (
		<>
			{isMobile ? <HeaderMobile /> : <HeaderDesktop />}
			{children}
			<Footer />
		</>
	);
}

export default Layout;
