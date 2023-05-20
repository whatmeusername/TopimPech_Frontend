import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './searchfield.scss';
import { useRef, useState, useEffect } from 'react';
import { toggleWindowScroll } from '../../../utils/enableWindowScroll';
import { ProductData } from '../../CatalogComponents/Cards/interface';
import get from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PriceElement from '../../CatalogComponents/PriceElement.tsx/PriceElement';
import { declOfNum } from '../../../utils';
import useToggle from '../../../hooks/useToggle';

const SearchItemElement = ({ data, ToggleModal }: { data: ProductData; ToggleModal: (fixedState?: boolean | undefined) => void }) => {
	return (
		<Link
			className="search__result__item"
			href={`/product/${data.article}/`}
			onClick={() => {
				ToggleModal(false);
				toggleWindowScroll(true);
			}}
		>
			<div className="search__result__item__left">
				<div className="search__result__item__image__wrapper">
					<img src={`/api/${data.images.length > 0 ? data.images[0].path : ''}`} alt={data.name} className="search__result__item__image" />
				</div>
				<div className="search__result__item__content">
					<div className="search__result__label__wrapper">
						<span className="search__result__label">{data.name}</span>
						<span className="search__result__article">Артикул: {data.article}</span>
					</div>
					<div className="search__result__price__wrapper">
						<PriceElement sale={data.sale} price={data.price} />
					</div>
				</div>
			</div>
		</Link>
	);
};

export default function ProductSearch() {
	const router = useRouter();
	const [isToggled, Toggle] = useToggle();
	const [results, setResults] = useState<{ items: ProductData[]; count: number }>({ items: [], count: 0 });

	const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);
	const inputField = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (isToggled) {
			if (results.count === 1) {
				const enterHandler = (e: KeyboardEvent) => {
					if (e.code === 'Enter') {
						router.push(`/product/${results.items[0].article}`);
						Toggle(false);
						toggleWindowScroll(true);
					}
				};
				window.addEventListener('keydown', enterHandler);
				return () => window.removeEventListener('keydown', enterHandler);
			}
		}
	}, [isToggled, results.count]);

	const FocusEvent = (): void => {
		Toggle(true);
		toggleWindowScroll(false);
	};

	const FetchResult = () => {
		const value = inputField.current.value.trim();
		if (value !== '') {
			get(`/api/products/search/name/${value}`).then((res) => {
				setResults({ items: res.data.data, count: res.data.count });
			});
		}
	};

	const onKeyDown = (e: React.KeyboardEvent): void => {
		const value = inputField.current.value.trim();
		if (e.key === 'Enter' && value) {
			router.push(`/catalog/search/${value}`);
		} else if (!isToggled) {
			Toggle(true);
			toggleWindowScroll(false);
		}
		clearTimeout(timerRef?.current);
		timerRef.current = setTimeout(() => {
			FetchResult();
		}, 500);
	};

	return (
		<>
			<div className={`search__field__wrapper ${isToggled ? 'search__field__wrapper__active' : ''}`}>
				<div className="search__input__wrapper">
					<input type="text" className="search__field" onFocus={FocusEvent} ref={inputField} onKeyDown={onKeyDown} />
					<button className="search__field__button">
						<FontAwesomeIcon icon={faMagnifyingGlass} className="search__field__button__icon" />
					</button>
				</div>
				{isToggled ? (
					<div className="search__field__results__wrapper">
						<div className="search__field__results__content">
							{results.count > 0 ? (
								<div className="search__field__results__count">
									Найдено: {results.count} {declOfNum(results.count, ['товар', 'товара', 'товаров'])}
								</div>
							) : null}
							{results.items.map((item) => {
								return <SearchItemElement data={item} key={`search__field__item__${item.article}`} ToggleModal={Toggle} />;
							})}
						</div>
					</div>
				) : null}
			</div>
			{isToggled ? (
				<div
					className="search__field__background__clickable"
					onClick={() => {
						Toggle(false);
						toggleWindowScroll(true);
					}}
				/>
			) : null}
		</>
	);
}
