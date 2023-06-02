'use client';

import { ReactElement, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { centerModalControl } from '../../store';
import { createPortal } from 'react-dom';
import './CentralModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { createContext } from 'react';

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
						<FontAwesomeIcon icon={faXmark} />
					</button>
				</div>
			</div>
			<hr className="break__line__standard" />
		</>
	);
}

function ModalContentWrapper({ children, className }: { children?: ReactElement | ReactElement[] | null; className?: string }): ReactElement {
	return <div className={`modal__content ${className ?? ''}`}>{children}</div>;
}

function ModalFooterWrapper({ children, className }: { children?: ReactElement | ReactElement[] | null; className?: string }): ReactElement {
	return <div className={`modal__footer ${className ?? ''}`}>{children}</div>;
}

const ModalWrapper = observer(({ children, id, toggle }: { children?: ReactElement; id: string; toggle?: any }): ReactElement => {
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
});

export { ModalWrapper, ModalHead, ModalContentWrapper, ModalFooterWrapper };
