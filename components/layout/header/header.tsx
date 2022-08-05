import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

import SeachField from '../../searchfield/searchfield';
import Menu from '../Menu/Menu';
import Logo2 from '../../../public/images/Logo2.png';

const HeaderLogo = (): JSX.Element => {
	return (
		<Link href="/">
			<div className={styles.logo__wrapper}>
				<Image src={Logo2} className={styles.logo__main} alt=""></Image>
			</div>
		</Link>
	);
};

export default function Header() {
	return (
		<div className={styles.header__wrapper}>
			<header className={styles.header}>
				<HeaderLogo />
				<div className={' ' + styles.flex__items__center}>
					<Menu />
				</div>
				<div className={styles.center__wrapper + ' ' + styles.flex__items__center}>
					<SeachField />
				</div>
				<div className={styles.right__wrapper + ' ' + styles.flex__items__center}>icons</div>
			</header>
		</div>
	);
}
