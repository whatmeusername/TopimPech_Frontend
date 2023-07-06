import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

import Menu from '../Menu/Menu';

import SiteLogo from '../../../public/logo/SiteLogo.png';

import { ReactElement, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { useComparinsonProducts, useFavouritesProducts, useUserProductCart } from '../../../context/MobxStoreContext/MobxStoreContext';
import { CartIcon, ComparisonIcon, HeartNotFilledIcon, HomeIcon } from '../../IconsElements';
import { usePathname } from 'next/navigation';
import ProductSearch from '../searchfield/SearchFieldDesktop/SearchField';
import { SearchMobile } from '../searchfield/SearchFieldMobile/SearchFieldMobile';
import { headerSticky } from '../../../store/HeaderSticky';

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
		<Link href="/comparison" className="header__option__wrapper">
			<ComparisonIcon className="header__option__icon" />
			<p className="header__option__label">Сравнение</p>
			<div className="header__option__count__pin header__option__count__pin__favourite">{ComparisonStore.getCount()}</div>
		</Link>
	);
});

function HeaderMobile(): ReactElement {
	const pathname = usePathname();
	return (
		<div className="header__mobile__wrapper">
			<div className="header__mobile__upper">
				<div className="header__mobile__upper__content">
					<Link href="/">
						<Image src={SiteLogo} className="header__mobile__upper__logo" alt="логотип сайта TopimPech.ru" priority={false} />
					</Link>
					<SearchMobile />
				</div>
			</div>
			<div className="header__mobile__lower">
				<div className="header__mobile__lower__content">
					<Link href="/" className={`header__mobile__lower__link ${pathname === '/' ? 'header__mobile__lower__icon__active' : ''}`}>
						<div className="header__mobile__lower__icon__wrapper">
							<HomeIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Главная</p>
					</Link>
					<Menu mobile={true} />
					<Link
						href="/favourites"
						className={`header__mobile__lower__link ${pathname.includes('/favourites') ? 'header__mobile__lower__icon__active' : ''}`}
					>
						<div className="header__mobile__lower__icon__wrapper">
							<HeartNotFilledIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Избранное</p>
					</Link>
					<Link
						href="/comparison"
						className={`header__mobile__lower__link ${pathname.includes('/comparison') ? 'header__mobile__lower__icon__active' : ''}`}
					>
						<div className="header__mobile__lower__icon__wrapper">
							<ComparisonIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Сравнение</p>
					</Link>
					<Link href="/cart" className={`header__mobile__lower__link ${pathname.includes('/cart') ? 'header__mobile__lower__icon__active' : ''}`}>
						<div className="header__mobile__lower__icon__wrapper">
							<CartIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Корзина</p>
					</Link>
				</div>
			</div>
		</div>
	);
}

const HeaderDesktop = observer((): ReactElement => {
	const headerRef = useRef<HTMLDivElement>(null!);
	const observePoint = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([e]) => {
				headerRef.current?.classList?.toggle('header__sticky__enabled', e.intersectionRatio === 0);
			},
			{ threshold: 0.1, rootMargin: '50px' },
		);
		if (headerSticky.toggled) {
			observer.observe(observePoint.current);
		} else {
			headerRef.current?.classList?.remove('header__sticky__enabled');
			observer.unobserve(observePoint.current);
		}
		return () => {
			if (observePoint.current) observer.unobserve(observePoint.current);
			observer.disconnect();
		};
	}, [headerSticky.toggled]);

	return (
		<>
			<div className="header__wrapper" ref={headerRef}>
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
						<p className="header__info__contact__phone">+7 (999) 999 99 99</p>
					</div>
					<div className="header__main">
						<header className="header">
							<HeaderLogo />
							<div className="flex__items__center">
								<Menu mobile={false} />
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
			<div className="header__wrapper__observer__point" ref={observePoint} />
		</>
	);
});

export { HeaderDesktop, HeaderMobile };
