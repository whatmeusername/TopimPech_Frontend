'use client';

import { ReactElement } from 'react';
import { observer } from 'mobx-react-lite';
import { centerModalControl } from '../../store';
import './CentralModal.scss';

const ModalWrapper = observer(({ children, id, toggle }: { children?: ReactElement; id: string; toggle?: any }): ReactElement => {
	return (
		<div className={`center__modal__wrapper ${centerModalControl.getModal(id) ? 'center__modal__wrapper__active' : ''}`} id="center__modal">
			<div
				className="center__modal__hidder"
				onClick={() => {
					centerModalControl.toggle(id);
					if (toggle) toggle();
				}}
			/>
			<div className="center__modal__content__wrapper">{children}</div>
		</div>
	);
});

export { ModalWrapper };
