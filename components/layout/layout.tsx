'use client';

import Header from './header/header';
import Footer from './footer/footer';
import { ReactElement } from 'react';

export default function Layout({ children }: { children: ReactElement | ReactElement[] }) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
