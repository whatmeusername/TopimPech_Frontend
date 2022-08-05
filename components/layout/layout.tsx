import Header from './header/header';
import Footer from './footer/footer';

export default function Layout({ children }: { children: JSX.Element }) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}
