import './SearchField.scss';
import { useRef, useState, useEffect } from 'react';
import { toggleWindowScroll } from '../../../../utils/enableWindowScroll';
import { ProductData } from '../../../CatalogComponents/Cards/interface';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { declOfProduct } from '../../../../utils';
import useToggle from '../../../../hooks/useToggle';

import { useGlobalContext } from '../../../../context/GlobalContext/GlobalContext';
import { SearchIcon } from '../../../IconsElements';
import { SearchItemElement } from '../SearchItemElement/SearchItemElement';
import { NoResultFound } from '../NoResultFound/NoResultFound';

export default function ProductSearch() {
	const router = useRouter();
	const [isToggled, Toggle] = useToggle();
	const [results, setResults] = useState<{ data: { data: ProductData; highlight: { [K: string]: string[] } }[]; count: number }>({
		data: [],
		count: 0,
	});

	const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);
	const inputField = useRef<HTMLInputElement>(null!);
	const productCount = useGlobalContext().productCount;

	useEffect(() => {
		if (isToggled) {
			if (results.count === 1) {
				const enterHandler = (e: KeyboardEvent) => {
					if (e.code === 'Enter') {
						NavigateIn();
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
		if (value !== '' && value.length > 2) {
			axios({
				method: 'GET',
				url: `/api/products/search/name/?query=${value}`,
			}).then((res) => {
				setResults({ ...res.data });
			});
		}
	};

	const NavigateIn = (): void => {
		const value = inputField.current?.value;
		if (results.count === 1) {
			router.push(`/product/${results.data[0].data.slug}`);
			Toggle(false);
			toggleWindowScroll(true);
		} else if (value && value.length > 2 && results.count > 1) {
			router.push(`/catalog/search/?search=${value}`);
			Toggle(false);
			toggleWindowScroll(true);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent): void => {
		const value = inputField.current.value.trim();
		if (e.key === 'Enter' && value) {
			NavigateIn();
		} else if (!isToggled) {
			FocusEvent();
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
					<input
						type="text"
						className="search__field"
						onFocus={FocusEvent}
						ref={inputField}
						onKeyDown={onKeyDown}
						placeholder={`Поиск среди ${productCount} ${declOfProduct(productCount, true)}`}
						autoComplete="false"
						autoCapitalize="false"
						autoCorrect="false"
						spellCheck="false"
					/>
					<button className="search__field__button" title="перейти к результатам поиску" onClick={NavigateIn}>
						<SearchIcon className="search__field__button__icon" />
					</button>
				</div>
				{isToggled ? (
					<div className="search__field__results__wrapper">
						<div className="search__field__results__content">
							{results.count > 0 ? (
								<div className="search__field__results__count">
									Найдено: {results.count} {declOfProduct(results.count)}
								</div>
							) : (
								<NoResultFound searchString={inputField.current?.value?.trim()} />
							)}
							{(results.data ?? []).map((item) => {
								return (
									<SearchItemElement
										product={item.data}
										highlight={item.highlight}
										key={`search__field__item__${item.data.article}`}
										ToggleModal={Toggle}
									/>
								);
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
