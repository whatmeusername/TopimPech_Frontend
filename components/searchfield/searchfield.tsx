import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './searchfield.scss';
import { Dispatch, SetStateAction, useRef, useState, useEffect } from 'react';
import { toggleWindowScroll } from '../../utils/enableWindowScroll';
import { ProductData } from '../CatalogComponents/product/interface';
import get from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PriceElement from '../CatalogComponents/product/components/other/PriceElement';

const SearchItemElement = ({ data, s }: { data: ProductData; s: Dispatch<SetStateAction<boolean>> }) => {
	return (
		<Link
			className="search__result__item"
			href={`/product/${data.article}/`}
			onClick={(e) => {
				s(false);
				toggleWindowScroll(true);
			}}
		>
			<div className="search__result__item__left">
				<div className="search__result__item__image__wrapper">
					<img
						src={`/api/${data.images.length > 0 ? data.images[0].path : ''}`}
						alt=""
						className="search__result__item__image"
					/>
				</div>
				<div className="search__result__item__content">
					<div className="search__result__label__wrapper">
						<span className="search__result__label">{data.name}</span>
						<span className="search__result__article">Артикул: {data.article}</span>
					</div>
					<div className="search__result__price__wrapper">
						<PriceElement sale={10} price={data.price} />
					</div>
				</div>
			</div>
		</Link>
	);
};

export default function ProductSearch() {
	const router = useRouter();
	const [active, setActive] = useState<boolean>(false);
	const [results, setResults] = useState<{ items: ProductData[]; count: number }>({ items: [], count: 0 });

	const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);
	const inputField = useRef<HTMLInputElement>(null!);

	useEffect(() => {
		if (active) {
			if (results.count === 1) {
				const enterHandler = (e: KeyboardEvent) => {
					if (e.code === 'Enter') {
						router.push(`/product/${results.items[0].article}`);
						setActive(false);
						toggleWindowScroll(true);
					}
				};
				window.addEventListener('keydown', enterHandler);
				return () => window.removeEventListener('keydown', enterHandler);
			}
		}
	}, [active, results.count]);

	const FocusEvent = (e: React.FocusEvent): void => {
		setActive(true);
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
		if (!active) {
			setActive(true);
			toggleWindowScroll(false);
		}
		clearTimeout(timerRef?.current);
		timerRef.current = setTimeout(() => {
			FetchResult();
		}, 500);
	};

	return (
		<>
			<div className={`search__field__wrapper ${active ? 'search__field__wrapper__active' : ''}`}>
				<div className="search__input__wrapper">
					<input
						type="text"
						className="search__field"
						onFocus={FocusEvent}
						ref={inputField}
						onKeyDown={onKeyDown}
					/>
					<button className="search__field__button">
						<FontAwesomeIcon icon={faMagnifyingGlass} className="search__field__button__icon" />
					</button>
				</div>
				{active ? (
					<div className="search__field__results__wrapper">
						<div className="search__field__results__content">
							{results.count > 0 ? (
								<div className="search__field__results__count">Найдено: {results.count}</div>
							) : null}
							{results.items.map((item) => {
								return (
									<SearchItemElement
										data={item}
										key={`search__field__item__${item.article}`}
										s={setActive}
									/>
								);
							})}
						</div>
					</div>
				) : null}
			</div>
			{active ? (
				<div
					className="search__field__background__clickable"
					onClick={(e) => {
						setActive(false);
						toggleWindowScroll(true);
					}}
				/>
			) : null}
		</>
	);
}
