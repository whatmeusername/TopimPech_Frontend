import useToggle from '../../hooks/useToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import styles from './Dropdown.module.scss';

function Dropdown({ children, header }: { children: JSX.Element; header: JSX.Element }) {
	const [toggled, setToggle] = useToggle();

	return (
		<div className={styles.dropdown__wrapper}>
			<button className={styles.dropdown__toggle__button} onClick={() => setToggle()}>
				{header}
				<FontAwesomeIcon
					icon={faAngleDown}
					className={`${styles.dropdown__toggle__arrow} ${
						toggled ? styles.dropdown__toggle__arrow__active : ''
					}`}
				/>
			</button>
			<div className={`${styles.dropdown__content} ${toggled ? styles.dropdown__content__active : ''}`}>
				{children}
			</div>
		</div>
	);
}

export default Dropdown;
