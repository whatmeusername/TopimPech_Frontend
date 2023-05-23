import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

import ProductSearch from '../searchfield/searchfield';
import Menu from '../Menu/Menu';
import Logo from '../../../public/images/SiteLogo.png';

import Cart from '../../../public/OptionsIcons/cart.svg';
import Comparison from '../../../public/OptionsIcons/Comparison.svg';
import Heart from '../../../public/OptionsIcons/HeartNotFilled.svg';

import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { useFavouritesProducts, useUserProductCart } from '../../../context/MobxStoreContext/MobxStoreContext';

const HeaderLogo = (): JSX.Element => {
	return (
		<Link href="/">
			<div className="logo__wrapper">
				<Image src={Logo} className="logo__main" alt="логотип сайта TopimPech.ru" priority={true}></Image>
			</div>
		</Link>
	);
};

const CartElement = observer((): ReactElement => {
	const ProductCart = useUserProductCart();
	return (
		<button className="header__option__wrapper">
			<Cart className="header__option__icon" />
			<p className="header__option__label">Корзина</p>
			<div className="header__option__count__pin header__option__count__pin__cart">{ProductCart.getCount()}</div>
		</button>
	);
});

const FavouriteElement = observer((): ReactElement => {
	const FavouritesProducts = useFavouritesProducts();
	return (
		<Link href="/favourites" className="header__option__wrapper">
			<Heart className="header__option__icon" />
			<p className="header__option__label">Избранное</p>
			<div className="header__option__count__pin header__option__count__pin__favourite">{FavouritesProducts.getCount()}</div>
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
