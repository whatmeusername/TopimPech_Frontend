import { useEffect, memo, createContext, useContext } from 'react';
import './menu.scss';

import useToggle from '../../../hooks/useToggle';
import useWindowSize from '../../../hooks/useWindowSize';

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import MenuContentMobile from './MenuContentMobile';
import MenuContentDesktop from './MenuContentDesktop';
import { CloseButton } from './GeneralElements';

import { useCategoriesContext } from '../../GlobalContext/';

export const ToggleModalContext = createContext<(fixedState?: boolean) => void>(null!);

export const useToggleModalContext = (): ((fixedState?: boolean) => void) => {
	return useContext(ToggleModalContext);
};

const MenuContent = memo((): JSX.Element => {
	const { width } = useWindowSize();

	const categories = useCategoriesContext()?.get();

	if (width === undefined || width >= 1024) {
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
		return (
			<div className="menu__content__wrapper">
				<div className="menu__content__mobile__wrapper">
					<div className="menu__content__upper__wrapper">
						<div className="menu__content__header__mobile">
							<span>Категории</span>
						</div>
						<CloseButton />
					</div>
					<div className="menu__content__mobile">
						{categories ? <MenuContentMobile categories={categories} /> : null}
					</div>
				</div>
			</div>
		);
	}
});

MenuContent.displayName = 'MenuContent';

export default function Menu() {
	const [modalActive, setModalActive] = useToggle();

	useEffect(() => {
		if (modalActive) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
	}, [modalActive]);

	return (
		<>
			<button className="menu__button" onClick={() => setModalActive(false)}>
				<FontAwesomeIcon icon={faBars} className="menu__button__icon" />
				<p className="menu__button__label">Каталог</p>
			</button>
			<div
				className={`menu__content__active__blackscreen ${
					modalActive ? 'blackscreen__inactive' : 'blackscreen__active'
				}`}
				onClick={() => setModalActive(false)}
			></div>
			<div className={`menu__content__modal ${modalActive ? 'modal__unhidden' : 'modal__hidden'}`}>
				<ToggleModalContext.Provider value={setModalActive}>
					<MenuContent />
				</ToggleModalContext.Provider>
			</div>
		</>
	);
}
