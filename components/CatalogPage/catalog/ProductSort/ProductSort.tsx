import { useRef } from 'react';

import styles from './ProductSort.module.scss';

import useModal from '../../../../hooks/useModal';

import { useRouter } from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

interface SortItem {
	slug: string;
	name: string;
}

const isClient = typeof window !== 'undefined';

function ProductSort({ disabled }: { disabled?: boolean }): JSX.Element {
	const router = useRouter();
	const selectedSort = router.query['order'] ?? '';
	const searchParams = isClient ? new URLSearchParams(window.location.search) : ({} as URLSearchParams);

	const modal = useRef<HTMLDivElement>(null!);
	const [modalActive, setModalActive] = useModal(modal);

	disabled = disabled === undefined ? false : disabled;

	const sortOptions: SortItem[] = [
		{ slug: 'id', name: 'по популярности' },
		{ slug: 'price', name: 'Сначала подешевле' },
		{ slug: '-price', name: 'Сначала подороже' },
		{ slug: 'updated', name: 'По обновленвию' },
	];

	const selected = (sortOptions.find((s) => s.slug === selectedSort) ?? sortOptions[0]) as SortItem;

	const setSort = (sortItem: SortItem) => {
		searchParams.set('order', sortItem.slug);
		searchParams.set('page', '1');
		router.push({
			pathname: window.location.pathname,
			query: searchParams.toString(),
		});
	};

	const SortItem = ({ sortItem }: { sortItem: SortItem }): JSX.Element => {
		return (
			<div
				className={`${styles.modal__sort__item} ${
					selected.name === sortItem.name ? styles.modal__sort__item__active : ''
				}`}
				onClick={() => {
					if (!disabled) {
						setModalActive(false);
						setSort(sortItem);
					}
				}}
			>
				<span>{sortItem.name}</span>
			</div>
		);
	};

	return (
		<div
			className={`${styles.product__sort__wrapper} ${disabled ? styles.product__sort__wrapper__disabled : ''}`}
			ref={modal}
		>
			<button
				className={`${styles.product__sort__button} ${modalActive ? styles.product__sort__button__active : ''}`}
				onClick={() => {
					if (!disabled) setModalActive(!modalActive);
				}}
			>
				<span>{selected.name}</span>
				<FontAwesomeIcon icon={faAngleUp} className={styles.product__sort__button__icon} />
			</button>
			{!disabled ? (
				<div
					className={`${styles.product__sort__modal} ${
						modalActive ? styles.product__sort__modal__active : ''
					}`}
				>
					<div className={styles.product__sort__modal__content}>
						{sortOptions.map((sortItem) => {
							return <SortItem sortItem={sortItem} key={`modal-item-${sortItem.slug}`} />;
						})}
					</div>
				</div>
			) : (
				''
			)}
		</div>
	);
}

export default ProductSort;
