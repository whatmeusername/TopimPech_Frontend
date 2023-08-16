'use client';

import { ReactElement, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { centerModalControl } from '../../store';
import { createPortal } from 'react-dom';
import './CentralModal.scss';
import { createContext } from 'react';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import { DeleteIcon } from '../IconsElements';

const ModalContext = createContext<{ id: string; toggle: any }>(null!);

function ModalHead({ children, className }: { children?: ReactElement | ReactElement[] | null; className?: string }): ReactElement {
	const { id, toggle } = useContext(ModalContext);

	return (
		<>
			<div className={`modal__head ${className ?? ''}`}>
				{children ? <div className="modal__header__wrapper">{children}</div> : null}
				<div className="modal__close__wrapper">
					<button
						className="modal__close__wrapper__button"
						onClick={() => {
							if (toggle) toggle();
							centerModalControl.toggle(id);
						}}
					>
						<DeleteIcon className="modal__close__wrapper__button__icon" />
					</button>
				</div>
			</div>
			<StandardBreakLine />
		</>
	);
}

function ModalContentWrapper({
	children,
	className,
}: {
	children?: (ReactElement | ReactElement | null)[] | ReactElement | null;
	className?: string;
}): ReactElement {
	return <div className={`modal__content ${className ?? ''}`}>{children}</div>;
}

function ModalFooterWrapper({
	children,
	className,
	isFixed,
}: {
	children?: ReactElement | ReactElement[] | null;
	className?: string;
	isFixed?: boolean;
}): ReactElement {
	return <div className={`modal__footer ${className ?? ''} ${isFixed ? 'modal__footer__fixed' : ''}`}>{children}</div>;
}

const ModalWrapper = observer(
	({ children, id, toggle }: { children?: ReactElement | ReactElement[]; id: string; toggle?: any }): ReactElement | null => {
		if (typeof document === 'undefined') return null;
		return createPortal(
			<div className={`center__modal__wrapper ${centerModalControl.getModal(id) ? 'center__modal__wrapper__active' : ''}`} id="center__modal">
				<div
					className="center__modal__hidder"
					onClick={() => {
						centerModalControl.toggle(id);
						if (toggle) toggle();
					}}
				/>
				<div className="center__modal__content__wrapper">
					<ModalContext.Provider value={{ id: id, toggle: toggle }}>{children}</ModalContext.Provider>
				</div>
			</div>,
			document.body,
		);
	},
);

export { ModalWrapper, ModalHead, ModalContentWrapper, ModalFooterWrapper };
