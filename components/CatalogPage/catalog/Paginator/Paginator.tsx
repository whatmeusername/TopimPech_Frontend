import styles from './Paginator.module.scss';

import { PaginatorData } from './interface';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SpreadElement = ({ enabled }: { enabled: boolean }): JSX.Element => {
	return (
		<span className={`${styles.paginator__spread}${enabled ? '' : styles.paginator__spread__disabled}`}>...</span>
	);
};

const ScrollToTop = () => {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'auto',
	});
};

function Paginator({ PaginatorData, range = 3 }: { PaginatorData: PaginatorData; range?: number }): JSX.Element {
	const router = useRouter();
	const searchParams = router.query;

	const startArr = [];
	const endArr = [];
	for (let i = 1; i <= range; i++) {
		startArr.push(range + 1 - i);
		endArr.push(i);
	}

	const PageElement = ({ page, current }: { page: number; current?: boolean }): JSX.Element => {
		if (current) {
			return <span className={`${styles.paginator__item} ${styles.paginator__item__active}`}>{page}</span>;
		} else {
			return (
				<Link href={{ pathname: router.pathname, query: { ...searchParams, page: page } }}>
					<a className={styles.paginator__item} onClick={ScrollToTop}>
						{page}
					</a>
				</Link>
			);
		}
	};

	const PaginatorArrow = ({ enabled, page, label }: { enabled: boolean; page: number; label: string }) => {
		if (enabled) {
			return (
				<div className={styles.paginator__arrow__wrapper}>
					<Link href={{ pathname: router.pathname, query: { ...searchParams, page: page } }}>
						<a className={styles.paginator__link} onClick={ScrollToTop}>
							<span className={styles.paginator__arrow__label}>{label}</span>
						</a>
					</Link>
				</div>
			);
		} else {
			return (
				<div className={`${styles.paginator__arrow__wrapper} ${styles.paginator__arrow__disabled}`}>
					<span className={`${styles.paginator__link} ${styles.paginator__link__disabled}`}>
						<span className={`${styles.paginator__arrow__label}`}>{label}</span>
					</span>
				</div>
			);
		}
	};

	if (PaginatorData.pages === 1) {
		return <></>;
	}
	return (
		<div className={styles.paginator__wrapper}>
			<PaginatorArrow page={PaginatorData.page - 1} enabled={PaginatorData.previous} label={'назад'} />
			<SpreadElement enabled={PaginatorData.page - range > 1} />
			{startArr.map((range) => {
				let previous = PaginatorData.page - range;
				if (previous > 0) {
					return <PageElement page={previous} key={`previous-page-${previous}`} />;
				} else return '';
			})}
			<PageElement page={PaginatorData.page} current={true} />
			{endArr.map((range) => {
				let next = PaginatorData.page + range;
				if (next <= PaginatorData.pages) {
					return <PageElement page={next} key={`next-page-${next}`} />;
				} else return '';
			})}
			<SpreadElement enabled={PaginatorData.page + range < PaginatorData.pages} />
			<PaginatorArrow page={PaginatorData.page + 1} enabled={PaginatorData.next} label={'вперед'} />
		</div>
	);
}

export default Paginator;
