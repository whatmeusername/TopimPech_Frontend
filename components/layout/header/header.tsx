import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

import ProductSearch from '../searchfield/searchfield';
import Menu from '../Menu/Menu';
import Logo from '../../../public/images/SiteLogo.png';

const HeaderLogo = (): JSX.Element => {
	return (
		<Link href="/">
			<div className="logo__wrapper">
				<Image src={Logo} className="logo__main" alt=""></Image>
			</div>
		</Link>
	);
};

export default function Header() {
	return (
		<div className="header__wrapper">
			<header className="header">
				<HeaderLogo />
				<div className="flex__items__center">
					<Menu />
				</div>
				<div className="center__wrapper flex__items__center">
					<ProductSearch />
				</div>
				<div className="right__wrapper flex__items__center">icons</div>
			</header>
		</div>
	);
}
