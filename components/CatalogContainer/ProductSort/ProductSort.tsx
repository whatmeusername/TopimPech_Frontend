import { useRef } from 'react';

import './productSort.scss';

import useModal from '../../../hooks/useModal';

import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { SortItem } from './interface';

const sortOptions: SortItem[] = [
	{ slug: 'id', name: 'по популярности' },
	{ slug: 'price', name: 'Сначала подешевле' },
	{ slug: '-price', name: 'Сначала подороже' },
	{ slug: 'updated', name: 'По обновленвию' },
];

function ProductSort({ disabled }: { disabled?: boolean }): JSX.Element {
	const router = useRouter();
	const selectedSort = router.query['order'];
	const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : ({} as URLSearchParams);

	const modal = useRef<HTMLDivElement>(null!);
	const [modalActive, setModalActive] = useModal(modal);

	const selected = selectedSort ? sortOptions.find((s) => s.slug === selectedSort) ?? sortOptions[0] : sortOptions[0];

	const setSort = (sortItem: SortItem) => {
		searchParams.set('order', sortItem.slug);
		searchParams.set('page', '1');
		router.push({
			pathname: window.location.pathname,
			query: searchParams.toString(),
		});
	};

	const SortItemElement = ({ SortItemData }: { SortItemData: SortItem }): JSX.Element => {
		return (
			<div
				className={`modal__sort__item ${selected.name === SortItemData.name ? 'modal__sort__item__active' : ''}`}
				onClick={() => {
					if (!disabled) {
						setModalActive(false);
						setSort(SortItemData);
					}
				}}
			>
				<span>{SortItemData.name}</span>
			</div>
		);
	};

	return (
		<div className={`product__sort__wrapper ${disabled ? 'product__sort__wrapper__disabled' : ''}`} ref={modal}>
			<button
				className={`product__sort__button ${modalActive ? 'product__sort__button__active' : ''}`}
				onClick={() => {
					if (!disabled) setModalActive(!modalActive);
				}}
			>
				<span>{selected.name}</span>
				<FontAwesomeIcon icon={faAngleUp} className="product__sort__button__icon" />
			</button>
			{!disabled ? (
				<div className={`product__sort__modal ${modalActive ? 'product__sort__modal__active' : ''}`}>
					<div className="product__sort__modal__content">
						{sortOptions.map((sortItem) => {
							return <SortItemElement SortItemData={sortItem} key={`modal-item-${sortItem.slug}`} />;
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}

export default ProductSort;
