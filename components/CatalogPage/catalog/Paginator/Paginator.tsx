import './paginator.scss';

import { PaginatorData } from './interface';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

function Paginator({
	PaginatorData,
	range = 3,
}: {
	PaginatorData: PaginatorData;
	range?: number;
}): ReactElement | null {
	const router = useRouter();

	if (PaginatorData.pages === 1) {
		return null;
	}

	const searchParams = router.query;
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
			return (
				<Link
					href={{ pathname: router.pathname, query: { ...searchParams, page: page } }}
					className="paginator__item"
					onClick={ScrollToTop}
				>
					{page}
				</Link>
			);
		}
	};

	const PaginatorArrow = ({
		enabled,
		page,
		label,
	}: {
		enabled: boolean;
		page: number;
		label: string;
	}): ReactElement => {
		if (enabled) {
			return (
				<div className="paginator__arrow__wrapper">
					<Link
						href={{ pathname: router.pathname, query: { ...searchParams, page: page } }}
						className="paginator__link"
						onClick={ScrollToTop}
					>
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
				if (previous > 0) {
					return <PageElement page={previous} key={`previous-page-${previous}`} />;
				} else return '';
			})}
			<PageElement page={PaginatorData.page} current={true} />
			{endArr.map((range) => {
				const next = PaginatorData.page + range;
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
