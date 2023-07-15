import Link from 'next/link';
import Image from 'next/image';

import './header.scss';

import Menu from '../Menu/Menu';

import { ReactElement, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';

import { useComparinsonProducts, useFavouritesProducts, useUserProductCart } from '../../../context/MobxStoreContext/MobxStoreContext';
import { CartIcon, ComparisonIcon, HeartNotFilledIcon, HomeIcon, SiteLogo } from '../../IconsElements';
import { usePathname } from 'next/navigation';
import ProductSearch from '../searchfield/SearchFieldDesktop/SearchField';
import { SearchMobile } from '../searchfield/SearchFieldMobile/SearchFieldMobile';
import { headerSticky } from '../../../store/HeaderSticky';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';

const HeaderLogo = (): JSX.Element => {
	return (
		<Link href="/">
			<div className="logo__wrapper">
				<SiteLogo className="logo__main" />
			</div>
		</Link>
	);
};

const CartElement = observer((): ReactElement => {
	const ProductCart = useUserProductCart();
	return (
		<Link className="header__option__wrapper" href={'/cart'}>
			<CartIcon className="header__option__icon" />
			<p className="header__option__label">Корзина</p>
			<div className="header__option__count__pin header__option__count__pin__cart">{ProductCart.getCount()}</div>
		</Link>
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

	const isMenuActive = pathname.includes('catalog') || pathname.includes('product');
	const isHome = pathname === '/';
	const isFavourite = pathname.includes('/favourites');
	const isComparison = pathname.includes('/comparison');
	const isCart = pathname.includes('/cart');

	return (
		<div className="header__mobile__wrapper">
			<div className="header__mobile__upper">
				<div className="header__mobile__upper__content">
					<Link href="/">
						<SiteLogo className="header__mobile__upper__logo" />
					</Link>
					<SearchMobile />
				</div>
			</div>
			<div className="header__mobile__lower">
				<div className="header__mobile__lower__content">
					<Link href="/" className={`header__mobile__lower__link ${isHome ? 'header__mobile__lower__icon__active' : ''}`}>
						<div className="header__mobile__lower__icon__wrapper">
							<HomeIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Главная</p>
					</Link>
					<Menu mobile={true} isActive={isMenuActive} />
					<Link href="/favourites" className={`header__mobile__lower__link ${isFavourite ? 'header__mobile__lower__icon__active' : ''}`}>
						<div className="header__mobile__lower__icon__wrapper">
							<HeartNotFilledIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Избранное</p>
					</Link>
					<Link href="/comparison" className={`header__mobile__lower__link ${isComparison ? 'header__mobile__lower__icon__active' : ''}`}>
						<div className="header__mobile__lower__icon__wrapper">
							<ComparisonIcon className="header__mobile__lower__icon" />
						</div>
						<p className="header__mobile__lower__label">Сравнение</p>
					</Link>
					<Link href="/cart" className={`header__mobile__lower__link ${isCart ? 'header__mobile__lower__icon__active' : ''}`}>
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
	const globalContext = useGlobalContext();
	const headerRef = useRef<HTMLDivElement>(null!);
	const observePoint = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([e]) => {
				headerRef.current?.classList?.toggle('header__sticky__enabled', e.intersectionRatio === 0);
			},
			{ threshold: 0.1 },
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
						<div className="header__info__contact__phone__wrapper">
							{globalContext.basePhoneNumber.map((phone, i) => {
								return (
									<p className="header__info__contact__phone" key={`contact__phone__${i}`}>
										{phone}
									</p>
								);
							})}
						</div>
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
