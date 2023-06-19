import { Fragment, ReactElement, useEffect, useRef, useState } from 'react';
import { ProductData } from '../CatalogComponents/Cards/interface';
import { ProductComparisonData, ComparisonProductsConfig, ComparisonState } from './interface';

import './ComparisonProducts.scss';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';
import Link from 'next/link';

import Arrow from '../../public/arrows/Arrow.svg';

function GatherProductComparisonData(products: ProductData[], diffWith?: ProductData): ProductComparisonData {
	const result: ProductComparisonData = {};
	const keys: Set<string> = new Set<string>();

	for (let i = 0; i < products.length; i++) {
		const product = products[i];
		if (product.properties) {
			for (let j = 0; j < product.properties?.length; j++) {
				const property = product.properties[j];
				keys.add(property.key.name);
				if (!result[property.key.name]) {
					result[property.key.name] = { values: [], unit: property.key.valueUnit };
				}
			}
		}
	}

	keys.forEach((key) => {
		const diffProperty = diffWith ? diffWith.properties?.find((v) => v.key.name === key) : null;
		for (let i = 0; i < products.length; i++) {
			const product = products[i];
			const property = product.properties?.find((v) => v.key.name === key);
			if (property) {
				const res: any = { value: property.value, state: null, distance: null, isNull: false };
				if (diffProperty && property.valueType === 0) {
					const n1 = Number(diffProperty.value);
					const n2 = Number(property.value);
					res.state = n1 === n2 ? ComparisonState.SAME : n1 > n2 ? ComparisonState.DECREASE : ComparisonState.RAISING;
					res.distance = n1 === n2 ? 0 : n1 > n2 ? n1 - n2 : n2 - n1;
				} else if (diffProperty && property.valueType === 1) {
					res.state = diffProperty.value !== property.value ? ComparisonState.CHANGED : ComparisonState.SAME;
				}
				result[key].values.push(res);
			} else {
				result[key].values.push({ value: '-', state: null, isNull: true });
			}
		}
	});

	return result;
}

function ComparisonProductsCardBig({ product, config }: { product: ProductData; config: ComparisonProductsConfig }): ReactElement {
	return (
		<div className="comparison__products__card" key={`comparison__card__${product.article}`}>
			<Link href={`/product/${product.article}`}>
				<div className="comparison__products__card__img__wrapper">
					<img src={`${config.URLstart ?? ''}${product.images[0].path}`} className="comparison__products__card__img" />
				</div>
				<p className="comparison__products__header">{product.name}</p>
			</Link>
			<PriceElement price={product.price} sale={10} />
			<AddToCartButton article={product.article} />
		</div>
	);
}

const ComparisonStateInfo = [
	{ text: 'Значение характеристки выше относительно текущего товара', class: 'comparison__products__raising' },
	{ text: 'Значение характеристки ниже относительно текущего товара', class: 'comparison__products__decrease' },
	{ text: 'Значение характеристки отличается от текущего товара', class: 'comparison__products__changed' },
];
function ComparisonProducts({ config }: { config: ComparisonProductsConfig }): ReactElement {
	const ProductComparisonData = useRef<ProductComparisonData>(GatherProductComparisonData(config.data, config.diffWith));

	const itemWidth = 200;

	const cardWrapper = useRef<HTMLDivElement>(null!);
	const rowsRefs = useRef<HTMLDivElement[]>([]);
	const rowsWrapper = useRef<HTMLDivElement>(null!);
	const comparisonWrapper = useRef<HTMLDivElement>(null!);

	const [sliderLength, setSliderLength] = useState<number>(0);
	const [current, setCurrent] = useState<number>(0);

	let nextOffset = 0;
	let dragOffset = 0;
	let rect: DOMRect | null = null;

	useEffect(() => {
		setSliderLength((cardWrapper.current.offsetWidth - comparisonWrapper.current.offsetWidth) / itemWidth);
		return () => {
			window.removeEventListener('mousemove', DragMove);
			window.removeEventListener('mouseup', DragMove);
		};
	}, [config]);

	const DragStart = (event: React.MouseEvent) => {
		if (cardWrapper.current) {
			cardWrapper.current.style.transition = 'unset';
			rowsRefs.current.forEach((row) => {
				if (row) row.style.transition = 'unset';
			});

			rect = comparisonWrapper.current.getBoundingClientRect();
			dragOffset = event.clientX - rect.left + itemWidth * current;

			window.addEventListener('mousemove', DragMove);
			window.addEventListener('mouseup', DragEnd);
		}
	};

	const removeEvents = () => {
		window.removeEventListener('mousemove', DragMove);
		window.removeEventListener('mouseup', DragMove);
	};

	const SoftMove = (side: 'next' | 'back') => {
		if (cardWrapper.current) {
			rowsRefs.current.forEach((row) => {
				if (row) row.style.transition = 'left 0.25s ease';
			});
			cardWrapper.current.style.transition = 'left 0.25s ease';
			let to = 0;
			if (side === 'next' && current !== sliderLength) {
				if ((sliderLength - current) % 1 > 0) {
					to = (sliderLength - current) % 1;
				} else {
					to = 1;
				}
				setCurrent(current + to);
			} else if (side === 'back' && current > 0) {
				if (current % 1 > 0) {
					to = current % 1;
				} else {
					to = 1;
				}
				setCurrent(current - to);
			}
		}
	};

	const DragEnd = () => {
		removeEvents();

		if (cardWrapper.current) {
			rowsRefs.current.forEach((row) => {
				if (row) row.style.transition = 'left 0.25s ease';
			});
			cardWrapper.current.style.transition = 'left 0.25s ease';

			const slidesPassedRation = (nextOffset * -1) / itemWidth - current;
			const slidesPassed = Math.round(slidesPassedRation);

			if (slidesPassed > 0 && current !== sliderLength) {
				setCurrent(current + slidesPassed > sliderLength ? sliderLength : current + slidesPassed);
			} else if (slidesPassed < 0 && current !== 0) {
				setCurrent(current + slidesPassed > 0 ? current + slidesPassed : 0);
			} else {
				const prev = `-${itemWidth * current}px`;

				rowsRefs.current.forEach((row) => {
					if (row) row.style.left = prev;
				});
				cardWrapper.current.style.left = prev;
			}
		}
	};

	const DragMove = (event: MouseEvent) => {
		if (!rect || !cardWrapper.current) {
			removeEvents();
			return;
		}

		nextOffset = event.clientX - rect.left - dragOffset;

		rowsRefs.current.forEach((row) => {
			row.style.left = `${nextOffset}px`;
		});
		cardWrapper.current.style.left = `${nextOffset}px`;
	};

	const ProductComparisonDataEntries = Object.entries(ProductComparisonData.current);

	return (
		<div className="comparison__products__wrapper" ref={comparisonWrapper}>
			<div className="comparison__products__header">
				<div className="comparison__products__card__slider__wrapper">
					<div
						className="comparison__products__card__slider"
						ref={cardWrapper}
						onMouseDown={sliderLength > 0 ? DragStart : undefined}
						style={{ left: `-${current * itemWidth}px` }}
					>
						{config.data.map((product) => {
							return <ComparisonProductsCardBig product={product} config={config} key={`comparison__card__${product.article}`} />;
						})}
					</div>
				</div>
				<div
					className={`comparison__products__header__arrow comparison__products__header__arrow__left ${
						current > 0 ? 'comparison__products__header__arrow__active' : 'comparison__products__header__arrow__inactive'
					}`}
					onClick={current > 0 ? () => SoftMove('back') : undefined}
				>
					<Arrow className="comparison__products__header__arrow__icon" />
				</div>
				<div
					className={`comparison__products__header__arrow comparison__products__header__arrow__right ${
						current !== sliderLength ? 'comparison__products__header__arrow__active' : 'comparison__products__header__arrow__inactive'
					}`}
					onClick={current !== sliderLength ? () => SoftMove('next') : undefined}
				>
					<Arrow className="comparison__products__header__arrow__icon" />
				</div>
			</div>
			<StandardBreakLine />

			<div className="comparison__products__data" onMouseDown={sliderLength > 0 ? DragStart : undefined} ref={rowsWrapper}>
				{ProductComparisonDataEntries.map(([key, bucket], index) => {
					return (
						<Fragment key={`comparison__row__${key}`}>
							<div className="comparison__products__row">
								<p className="comparison__products__row__header">{key}</p>
								<div
									className="comparison__products__row__values"
									ref={(el) => (rowsRefs.current[index] = el as HTMLDivElement)}
									style={{ left: `-${current * itemWidth}px` }}
								>
									{bucket.values.map((data, i) => {
										const value = `${data.value}${!data.isNull ? ` ${bucket.unit}` : ''}`;
										let StateClass = '';
										let postValue = '';
										if (data.state && data.state !== ComparisonState.SAME) {
											if (data.state === ComparisonState.DECREASE) {
												postValue = `(-${data.distance}${bucket.unit ? ` ${bucket.unit}` : ''})`;
												StateClass = 'comparison__products__decrease';
											} else if (data.state === ComparisonState.RAISING) {
												postValue = `(+${data.distance}${bucket.unit ? ` ${bucket.unit}` : ''})`;
												StateClass = 'comparison__products__raising';
											} else if (data.state === ComparisonState.CHANGED) {
												StateClass = 'comparison__products__changed';
											}
										}

										return (
											<span className={`comparison__products__row__value ${StateClass}`} key={`comparison__row__${key}__value__${i}`}>
												{value} {postValue}
											</span>
										);
									})}
								</div>
							</div>
							{index !== ProductComparisonDataEntries.length - 1 ? <ThinBreakLine /> : null}
						</Fragment>
					);
				})}
			</div>
			{config.diffLabels ? (
				<>
					<StandardBreakLine />
					<div className="comparsion__products__info">
						{ComparisonStateInfo.map((block) => {
							return (
								<div className="comparsion__products__info__block" key={`info__block__${block.class}`}>
									<span className={`comparsion__products__info__square ${block.class}`} />
									<span className="comparsion__products__info__label">{block.text}</span>
								</div>
							);
						})}
					</div>
				</>
			) : null}
		</div>
	);
}

export { ComparisonProducts };