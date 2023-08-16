import './paginator.scss';

import { PaginatorData } from './interface';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ReactElement } from 'react';

const SpreadElement = ({ enabled }: { enabled: boolean }): JSX.Element => {
	return <span className={`paginator__spread ${enabled ? '' : 'paginator__spread__disabled'}`}>...</span>;
};

const ScrollToTop = () => {
	window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'auto',
	});
};

function Paginator({ PaginatorData, range = 3 }: { PaginatorData: PaginatorData; range?: number }): ReactElement | null {
	const searchParams: any = useSearchParams();
	const path = usePathname();

	if (PaginatorData.pages === 1) {
		return null;
	}

	const startArr = [];
	const endArr = [];

	for (let i = 1; i <= range; i++) {
		startArr.push(range + 1 - i);
		endArr.push(i);
	}

	const PageElement = ({ page, current }: { page: number; current?: boolean }): ReactElement => {
		if (current) {
			return <span className={'paginator__item paginator__item__active'}>{page}</span>;
		} else {
			const nextSP = new URLSearchParams(searchParams);
			nextSP.set('page', `${page}`);
			return (
				<Link href={path + '?' + nextSP.toString()} className="paginator__item paginator__item__inactive" onClick={ScrollToTop}>
					{page}
				</Link>
			);
		}
	};

	const PaginatorArrow = ({ enabled, page, label }: { enabled: boolean; page: number; label: string }): ReactElement => {
		if (enabled) {
			const nextSP = new URLSearchParams(searchParams);
			nextSP.set('page', `${page}`);
			return (
				<div className="paginator__arrow__wrapper">
					<Link href={path + '?' + nextSP.toString()} className="paginator__link" onClick={ScrollToTop}>
						<span className="paginator__arrow__label">{label}</span>
					</Link>
				</div>
			);
		} else {
			return (
				<div className="paginator__arrow__wrapper paginator__arrow__disabled">
					<span className="paginator__link paginator__link__disabled">
						<span className="paginator__arrow__label">{label}</span>
					</span>
				</div>
			);
		}
	};

	return (
		<div className="paginator__wrapper">
			<PaginatorArrow page={PaginatorData.page - 1} enabled={PaginatorData.previous} label={'назад'} />
			<SpreadElement enabled={PaginatorData.page - range > 1} />
			{startArr.map((range) => {
				const previous = PaginatorData.page - range;
				return previous > 0 ? <PageElement page={previous} key={`previous-page-${previous}`} /> : null;
			})}
			<PageElement page={PaginatorData.page} current={true} />
			{endArr.map((range) => {
				const next = PaginatorData.page + range;
				return next <= PaginatorData.pages ? <PageElement page={next} key={`next-page-${next}`} /> : null;
			})}
			<SpreadElement enabled={PaginatorData.page + range < PaginatorData.pages} />
			<PaginatorArrow page={PaginatorData.page + 1} enabled={PaginatorData.next} label={'вперед'} />
		</div>
	);
}

export default Paginator;
