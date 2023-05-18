import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

import ProductSearch from '../searchfield/searchfield';
import Menu from '../Menu/Menu';
import Logo from '../../../public/images/SiteLogo.png';

import Cart from '../../../public/OptionsIcons/cart.svg';
import Comparison from '../../../public/OptionsIcons/comparison.svg';
import Heart from '../../../public/OptionsIcons/HeartNotFilled.svg';

import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { userProductCart } from '../../../store';
import { HydrationComponent } from '../../ProductPage/ProductPage';
import { favouritesProducts } from '../../../store/favourites';

const HeaderLogo = (): JSX.Element => {
	return (
		<Link href="/">
			<div className="logo__wrapper">
				<Image src={Logo} className="logo__main" alt=""></Image>
			</div>
		</Link>
	);
};

const CartElement = observer((): ReactElement => {
	return (
		<button className="header__option__wrapper">
			<Cart className="header__option__icon" />
			<p className="header__option__label">Корзина</p>
			<HydrationComponent>
				<div className="header__option__count__pin header__option__count__pin__cart">{userProductCart.getCount()}</div>
			</HydrationComponent>
		</button>
	);
});

const FavouriteElement = observer((): ReactElement => {
	return (
		<Link href="/favourites" className="header__option__wrapper">
			<Heart className="header__option__icon" />
			<p className="header__option__label">Избранное</p>
			<HydrationComponent>
				<div className="header__option__count__pin header__option__count__pin__favourite">{favouritesProducts.getCount()}</div>
			</HydrationComponent>
		</Link>
	);
});

const ComparisonElement = observer((): ReactElement => {
	return (
		<button className="header__option__wrapper">
			<Comparison className="header__option__icon" />
			<p className="header__option__label">Сравнение</p>
		</button>
	);
});

function Header() {
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
				<div className="right__wrapper">
					<FavouriteElement />
					<ComparisonElement />
					<CartElement />
				</div>
			</header>
		</div>
	);
}

export { Header };
