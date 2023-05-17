'use client';

import { Header } from './header/header';
import { Footer } from './footer/footer';
import { ReactElement } from 'react';

function Layout({ children }: { children: ReactElement | ReactElement[] }): ReactElement {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}

export default Layout;
