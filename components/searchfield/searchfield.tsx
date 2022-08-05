import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import styles from './searchfield.module.scss';

export default function SeachField() {
	return (
		<div className={styles.seachfield__wrapper}>
			<input type="text" className={styles.seachfield__input}></input>
			<button className={styles.seachfield__button}>
				<FontAwesomeIcon icon={faMagnifyingGlass} className={styles.seachfield__button__icon} />
			</button>
		</div>
	);
}
