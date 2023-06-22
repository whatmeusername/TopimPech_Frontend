'use client';

import { HeaderDesktop } from './header/header';
import { Footer } from './footer/footer';
import { ReactElement } from 'react';

function Layout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
	return (
		<>
			<HeaderDesktop />
			{children}
			<Footer />
		</>
	);
}

export default Layout;
