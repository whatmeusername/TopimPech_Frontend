import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

import ProductSearch from '../searchfield/searchfield';
import Menu from '../Menu/Menu';

import SiteLogo from '../../../public/logo/SiteLogo.png';

import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';

import { useComparinsonProducts, useFavouritesProducts, useUserProductCart } from '../../../context/MobxStoreContext/MobxStoreContext';
import { CartIcon, ComparisonIcon, HeartNotFilledIcon } from '../../IconsElements';

const HeaderLogo = (): JSX.Element => {
	return (
		<Link href="/">
			<div className="logo__wrapper">
				<Image src={SiteLogo} className="logo__main" alt="логотип сайта TopimPech.ru" priority={true}></Image>
			</div>
		</Link>
	);
};

const CartElement = observer((): ReactElement => {
	const ProductCart = useUserProductCart();
	return (
		<button className="header__option__wrapper">
			<CartIcon className="header__option__icon" />
			<p className="header__option__label">Корзина</p>
			<div className="header__option__count__pin header__option__count__pin__cart">{ProductCart.getCount()}</div>
		</button>
	);
});

const FavouriteElement = observer((): ReactElement => {
	const FavouritesProducts = useFavouritesProducts();
	return (
		<Link href="/favourites" className="header__option__wrapper">
			<HeartNotFilledIcon className="header__option__icon" />
			<p className="header__option__label">Избранное</p>
			<div className="header__option__count__pin header__option__count__pin__favourite">{FavouritesProducts.getCount()}</div>
		</Link>
	);
});

const ComparisonElement = observer((): ReactElement => {
	const ComparisonStore = useComparinsonProducts();
	return (
		<button className="header__option__wrapper">
			<ComparisonIcon className="header__option__icon" />
			<p className="header__option__label">Сравнение</p>
			<div className="header__option__count__pin header__option__count__pin__favourite">{ComparisonStore.getCount()}</div>
		</button>
	);
});

function HeaderDesktop() {
	return (
		<div className="header__wrapper">
			<div className="header__content__wrapper">
				<div className="header__info">
					<div className="header__info__content">
						<Link href="/" className="header__info__link">
							Доставка
						</Link>
						<Link href="/" className="header__info__link">
							Как заказать
						</Link>
						<Link href="/" className="header__info__link">
							Контакты
						</Link>
					</div>
				</div>
				<div className="header__main">
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
			</div>
		</div>
	);
}

export { HeaderDesktop };
