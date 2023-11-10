'use client';

import { memo } from 'react';
import './menu.scss';

import MenuContentDesktop from './MenuContentDesktop';
import { CloseButton } from './GeneralElements';
import { useCategoriesContext } from '../../../context/Categories';
import { MenuIcon } from '../../IconsElements';
import { menuModalControl } from '../../../store/MenuModal';
import { observer } from 'mobx-react-lite';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { MenuContentMobile } from './MenuContentMobile';
import { useGlobalContext } from '../../../context/GlobalContext/GlobalContext';
import { declOfProduct } from '../../../utils';
import { centerModalControl } from '../../../store/CenterModal';
import { StandardBreakLine } from '../../Shared/Lines/StandardBreakLine/StandardBreakLine';

const MenuContent = memo((): JSX.Element => {
	const isMobile = useMobile(1024);
	const categories = useCategoriesContext()?.get();

	if (!isMobile) {
		return (
			<>
				<div className="menu__content__wrapper">
					<div className="menu__content__desktop">
						<MenuContentDesktop categories={categories} />
						<div className="menu__content__close__button__wrapper">{categories ? <CloseButton /> : null}</div>
					</div>
				</div>
			</>
		);
	} else {
		const globalContext = useGlobalContext();
		return (
			<div className="menu__content__wrapper">
				<div className="menu__content__mobile__wrapper">
					<div className="menu__content__upper__wrapper">
						<div className="menu__content__header__mobile">
							<button
								className="menu__content__header__mobile__search"
								onClick={() => {
									menuModalControl.toggle(false);
									centerModalControl.toggle('SearchModal', true);
								}}
							>{`Поиск среди ${globalContext.productCount} ${declOfProduct(globalContext.productCount)}`}</button>
							<CloseButton />
						</div>
					</div>
					<StandardBreakLine />
					<div className="menu__content__mobile">{categories ? <MenuContentMobile /> : null}</div>
				</div>
			</div>
		);
	}
});

MenuContent.displayName = 'MenuContent';

export default function Menu({ mobile, isActive }: { mobile: boolean; isActive?: boolean }) {
	return (
		<>
			<button
				className={`menu__button ${
					mobile
						? `menu__button__mobile header__mobile__lower__link ${isActive ? 'menu__button__mobile__acitve' : ''}`
						: 'menu__button__mobile__desktop'
				}`}
				onClick={() => menuModalControl.toggle()}
			>
				<div className={`${mobile ? 'header__mobile__lower__icon__wrapper' : 'menu__button__mobile__desktop__icon__wrapper'}`}>
					<MenuIcon className={`menu__button__icon ${mobile ? 'header__mobile__lower__icon' : ''}`} />
				</div>
				<p className={`${mobile ? 'header__mobile__lower__label' : 'menu__button__label'}`}>Каталог</p>
			</button>
		</>
	);
}

const MenuModal = observer(() => {
	return (
		<>
			<div
				className={`menu__content__active__blackscreen ${menuModalControl.toggled ? 'blackscreen__inactive' : 'blackscreen__active'}`}
				onClick={() => menuModalControl.toggle(false)}
			/>
			<aside className={`menu__content__modal ${menuModalControl.toggled ? 'modal__unhidden' : 'modal__hidden'}`}>
				<MenuContent />
			</aside>
		</>
	);
});

export { MenuModal };
