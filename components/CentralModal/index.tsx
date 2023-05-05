import { ReactElement, useEffect, useRef } from 'react';
import { useCentralModalContext } from '../../context';
import { observer } from 'mobx-react-lite';
import { centerModalControl } from '../../store';
import './CentralModal.scss';

const ModalWrapper = observer(({ children }: { children: ReactElement }) => {
	return (
		<div className={`center__modal__wrapper ${centerModalControl.isToggled ? 'center__modal__wrapper__active' : ''}`} id="center__modal">
			<div className="center__modal__hidder" onClick={() => centerModalControl.toggle()} />
			<div className="center__modal__content__wrapper">{children}</div>
		</div>
	);
});

const CenterModal = observer(() => {
	const centralContext = useCentralModalContext();
	const modalContentRef = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		centralContext.ref = modalContentRef;
	}, []);

	return (
		<div className={`center__modal__wrapper ${centerModalControl.isToggled ? 'center__modal__wrapper__active' : ''}`} id="center__modal">
			<div className="center__modal__hidder" />
			<div className="center__modal__content__wrapper" ref={modalContentRef}></div>
		</div>
	);
});

export { CenterModal, ModalWrapper };
