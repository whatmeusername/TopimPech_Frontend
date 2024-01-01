import { ReactElement, useRef } from 'react';
import useModal from '../../../hooks/useModal';
import { QuestionIcon } from '../../IconsElements';
import './TipPopUpElement.scss';

function TipPopUpElement({ children }: { children?: ReactElement | null }): ReactElement {
	const popUpRef = useRef<HTMLDivElement>(null!);
	const [popUpActive, setPopUpActive] = useModal(popUpRef);
	return (
		<span className={`tip__pop__up__wrapper ${popUpActive ? 'tip__pop__up__active' : 'tip__pop__up__inactive'}`} ref={popUpRef}>
			<button className="tip__pop__up__button" onClick={() => setPopUpActive(!popUpActive)}>
				<QuestionIcon className="tip__pop__up__button__icon" />
			</button>
			<div className="tip__pop__up__content__modal">
				<div className="tip__pop__up__content">{children}</div>
			</div>
		</span>
	);
}

export { TipPopUpElement };
