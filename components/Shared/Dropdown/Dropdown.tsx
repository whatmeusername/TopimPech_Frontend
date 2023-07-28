import useToggle from '../../../hooks/useToggle';
import { AngleArrowIcon } from '../../IconsElements';

import './Dropdown.scss';
import { ReactElement } from 'react';

function Dropdown({ children, header }: { children?: ReactElement | ReactElement[]; header: JSX.Element }) {
	const [toggled, setToggle] = useToggle();

	return (
		<div className="dropdown__wrapper">
			<button className="dropdown__toggle__button" onClick={() => setToggle()}>
				{header}
				<AngleArrowIcon className={`dropdown__toggle__arrow__icon ${toggled ? 'dropdown__toggle__arrow__icon__active' : ''}`} />
			</button>
			<div className={`dropdown__content ${toggled ? 'dropdown__content__active' : ''}`}>{children}</div>
		</div>
	);
}

export default Dropdown;
