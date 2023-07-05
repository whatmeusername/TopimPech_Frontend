import { ReactElement, useRef, useState } from 'react';
import { centerModalControl } from '../../../../store';
import { ModalWrapper, ModalContentWrapper, ModalHead, ModalFooterWrapper } from '../../../CentralModal/CenterModal';
import { SearchIcon } from '../../../IconsElements';
import './SearchFieldMobile.scss';
import { declOfProduct } from '../../../../utils';
import { useGlobalContext } from '../../../../context/GlobalContext/GlobalContext';
import { ProductData } from '../../../CatalogComponents/Cards/interface';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { SearchItemElement } from '../SearchItemElement/SearchItemElement';
import Link from 'next/link';

// useEffect(() => {
// 	if (isToggled) {
// 		if (results.count === 1) {
// 			const enterHandler = (e: KeyboardEvent) => {
// 				if (e.code === 'Enter') {
// 					router.push(`/product/${results.items[0].article}`);
// 					Toggle(false);
// 					toggleWindowScroll(true);
// 				}
// 			};
// 			window.addEventListener('keydown', enterHandler);
// 			return () => window.removeEventListener('keydown', enterHandler);
// 		}
// 	}
// }, [isToggled, results.count]);

// const FocusEvent = (): void => {
// 	Toggle(true);
// 	toggleWindowScroll(false);
// };

// const FetchResult = () => {
// 	const value = inputField.current.value.trim();
// 	if (value !== '') {
// 		get(`/api/products/search/name/${value}`).then((res) => {
// 			setResults({ items: res.data.data, count: res.data.count });
// 		});
// 	}
// };

// const onKeyDown = (e: React.KeyboardEvent): void => {
// 	const value = inputField.current.value.trim();
// 	if (e.key === 'Enter' && value) {
// 		router.push(`/catalog/search/${value}`);
// 	} else if (!isToggled) {
// 		Toggle(true);
// 		toggleWindowScroll(false);
// 	}
// 	clearTimeout(timerRef?.current);
// 	timerRef.current = setTimeout(() => {
// 		FetchResult();
// 	}, 500);
// };

function SearchModal({ modalId }: { modalId: string }): ReactElement {
	const productCount = useGlobalContext().productCount;
	const router = useRouter();

	const [results, setResults] = useState<{ data: ProductData[]; count: number }>({ data: [], count: 0 });
	const timerRef = useRef<ReturnType<typeof setTimeout>>(null!);
	const inputField = useRef<HTMLInputElement>(null!);

	const FetchResult = () => {
		const value = inputField.current.value.trim();
		if (value !== '') {
			axios({
				method: 'GET',
				url: `/api/products/search/name/${value}`,
			}).then((res) => {
				setResults({ ...res.data });
			});
		}
	};

	const onKeyDown = (e: React.KeyboardEvent): void => {
		const value = inputField.current.value.trim();
		if (e.key === 'Enter' && value) {
			router.push(`/catalog/search/${value}`);
		}
		clearTimeout(timerRef?.current);
		timerRef.current = setTimeout(() => {
			FetchResult();
		}, 500);
	};

	return (
		<ModalWrapper id={modalId}>
			<ModalContentWrapper className="search__modal__content">
				<ModalHead className="search__modal__head">
					<input
						type="text"
						className="modal__search__input"
						placeholder={`Поиск среди ${productCount} теплых ${declOfProduct(productCount)}`}
						onKeyDown={onKeyDown}
						ref={inputField}
						autoComplete="false"
						autoCapitalize="false"
						autoCorrect="false"
						spellCheck="false"
					/>
				</ModalHead>
				<div className="modal__search__modal__results">
					{([...results.data, ...results.data] ?? []).map((item, i) => {
						return (
							<SearchItemElement
								data={item}
								key={`search__field__item__${item.article + i}`}
								ToggleModal={() => centerModalControl.toggle(modalId)}
							/>
						);
					})}
				</div>
				{results.count > 0 ? (
					<ModalFooterWrapper className="modal__search__modal__footer" isFixed={true}>
						<Link href={'/'} className="modal__search__modal__footer__show__all">
							Найдено {results.count} {declOfProduct(results.count)}
						</Link>
					</ModalFooterWrapper>
				) : null}
			</ModalContentWrapper>
		</ModalWrapper>
	);
}

function SearchMobile(): ReactElement {
	const modalId = 'SearchModal';
	return (
		<div className="header__mobile__search__button">
			<SearchIcon className="header__mobile__search__button__icon" onClick={() => centerModalControl.toggle(modalId)} />
			<SearchModal modalId={modalId}></SearchModal>
		</div>
	);
}

export { SearchMobile };
