import { Dispatch, Fragment, ReactElement, SetStateAction, useEffect, useRef, useState } from 'react';
import { ProductData } from '../CatalogComponents/Cards/interface';
import { ProductComparisonData, ComparisonProductsConfig, ComparisonState, ProductComparisonDataValue } from './interface';

import './ComparisonProducts.scss';
import { ThinBreakLine } from '../Shared/Lines/ThinBreakLine/ThinBreakLine';
import { StandardBreakLine } from '../Shared/Lines/StandardBreakLine/StandardBreakLine';
import PriceElement from '../CatalogComponents/PriceElement.tsx/PriceElement';
import AddToCartButton from '../CatalogComponents/AddToCartButton/AddToCartButton';
import Link from 'next/link';
import { ArrowIcon, TrashBinIcon } from '../IconsElements';
import { headerSticky } from '../../store/HeaderSticky';
import { useComparinsonProducts } from '../../context/MobxStoreContext/MobxStoreContext';
import { observer } from 'mobx-react-lite';
import { NO_IMAGE_SRC } from '../const';
import { OptionEmptyPage } from '../Shared/OptionEmptyPage/OptionEmptyPage';
import Image from 'next/image';

function GatherProductComparisonData(products: ProductData[], diffWith?: ProductData): ProductComparisonData {
	const result: ProductComparisonData = {};
	const keys: string[] = [];

	for (let i = 0; i < products.length; i++) {
		const product = products[i];
		if (!product.properties || product.properties.length === 0) continue;
		for (let j = 0; j < product.properties.length; j++) {
			const property = product.properties[j];
			if (result[property.key.name]) continue;
			keys.push(property.key.name);
			result[property.key.name] = { values: [], unit: property.key.valueUnit };
		}
	}

	keys.forEach((key) => {
		const diffProperty = diffWith ? diffWith.properties?.find((v) => v.key.name === key) : null;
		for (let i = 0; i < products.length; i++) {
			const property = products[i].properties?.find((v) => v.key.name === key);
			if (!property) {
				result[key].values.push({ value: '-', state: null, isNull: true });
				continue;
			}
			const res: ProductComparisonDataValue = { value: property.value, state: null, distance: null, isNull: false };

			if (diffProperty && property.valueType === 0) {
				const n1 = Number(diffProperty.value.replaceAll(',', '.'));
				const n2 = Number(property.value.replaceAll(',', '.'));

				res.state = n1 === n2 ? ComparisonState.SAME : n1 > n2 ? ComparisonState.DECREASE : ComparisonState.RAISING;
				res.distance = n1 === n2 ? 0 : n1 > n2 ? n1 - n2 : n2 - n1;
				res.distance = Number(res.distance.toFixed(2));
			} else if (diffProperty && property.valueType === 1) {
				res.state = diffProperty.value !== property.value ? ComparisonState.CHANGED : ComparisonState.SAME;
			}
			result[key].values.push(res);
		}
	});

	return result;
}

function ComparisonProductsCardBig({ product, config }: { product: ProductData; config: ComparisonProductsConfig }): ReactElement {
	const comparisonStore = useComparinsonProducts();

	return (
		<div className="comparison__products__card" key={`comparison__card__${product.article}`}>
			<Link href={`/product/${product.slug}`} className="comparison__products__card__link" draggable="false">
				<div className="comparison__products__card__img__wrapper">
					<Image
						src={`${config.URLstart ?? ''}${product.images?.[0]?.path ?? NO_IMAGE_SRC}`}
						alt={product.name}
						className="comparison__products__card__img"
						onError={(e) => {
							const target = e.target as HTMLImageElement;
							target.srcset = NO_IMAGE_SRC;
							target.src = NO_IMAGE_SRC;
						}}
						unoptimized={product.images?.[0]?.path?.endsWith('.gif') ?? false}
						width={180}
						height={180}
						style={{ objectFit: 'contain', maxInlineSize: '100%', height: 'auto' }}
						loading="lazy"
						draggable="false"
					/>
				</div>
				<p className="comparison__products__header">{product.name}</p>
			</Link>
			<PriceElement product={product} />
			<div className="comparison__products__options">
				<AddToCartButton product={product} isContactMode={false} showAvailability={false} />
				{config.cards.canDelete ? (
					<button className="comparison__products__options__remove" onClick={() => comparisonStore.remove(product)}>
						<TrashBinIcon className="comparison__products__options__remove__icon" />
					</button>
				) : null}
			</div>
		</div>
	);
}

const ComparisonStateInfo = [
	{ text: 'Значение характеристики выше относительно текущего товара', class: 'comparison__products__raising' },
	{ text: 'Значение характеристики ниже относительно текущего товара', class: 'comparison__products__decrease' },
	{ text: 'Значение характеристики отличается от текущего товара', class: 'comparison__products__changed' },
];

function ComparisonProductsCategories({
	data,
	setCategory,
	currentCategory,
}: {
	data: ProductData[];
	setCategory: Dispatch<SetStateAction<string | null>>;
	currentCategory: null | string;
}): ReactElement {
	const groups: { [K: string]: number } = {};
	data.forEach((product) => {
		const category = product.categories[product.categories.length > 1 ? 1 : 0];
		groups[category.name] = groups[category.name] ? groups[category.name] + 1 : 1;
	});

	const entries = Object.entries(groups);
	const isSingle = entries.length === 1;

	return (
		<div className="comparison__products__categories">
			{!isSingle ? (
				<button
					className={`comparison__products__categories__item ${!currentCategory ? 'comparison__products__categories__item__active' : ''}`}
					onClick={() => setCategory(null)}
				>
					<p className="comparison__products__categories__item__label">Все</p>
					<span className="comparison__products__categories__item__count">{data.length}</span>
				</button>
			) : null}
			{Object.entries(groups).map(([category, count]) => {
				return (
					<button
						className={`comparison__products__categories__item ${
							currentCategory === category ? 'comparison__products__categories__item__active' : ''
						} ${isSingle ? 'comparison__products__categories__item__single' : ''}`}
						key={`comparison__item__${category}`}
						onClick={!isSingle ? () => setCategory(category) : undefined}
					>
						<p className="comparison__products__categories__item__label">{category}</p>
						<span className="comparison__products__categories__item__count">{count}</span>
					</button>
				);
			})}
		</div>
	);
}

const ComparisonProducts = observer(({ config }: { config: ComparisonProductsConfig }): ReactElement | null => {
	const comparisonStore = useComparinsonProducts();
	const [unfilteredProductsData, setUnfilteredProductsData] = useState<ProductData[]>(config.data);
	const [productsData, setProductsData] = useState<ProductData[]>(config.data);
	const [ProductComparisonData, setProductComparisonData] = useState<ProductComparisonData>(
		GatherProductComparisonData(productsData, config.diffWith),
	);

	const itemWidth = useRef<number>(0);

	const observePoint = useRef<HTMLElement>(null!);
	const headerRef = useRef<HTMLDivElement>(null!);
	const cardWrapper = useRef<HTMLDivElement>(null!);
	const rowsRefs = useRef<HTMLDivElement[]>([]);
	const comparisonWrapper = useRef<HTMLDivElement>(null!);

	const [sliderLength, setSliderLength] = useState<number>(0);
	const [current, setCurrent] = useState<number>(0);
	const [currentCategory, setCurrentCategory] = useState<string | null>(null);

	let nextOffset = 0;
	let dragOffset = 0;
	let rect: DOMRect | null = null;

	useEffect(() => {
		if (observePoint.current && config.cards.isSticky) {
			headerSticky.toggle(false);
			const observer = new IntersectionObserver(
				([e]) => {
					if (observePoint.current) {
						const isScrolled = window.scrollY > observePoint.current.offsetTop;
						headerRef.current?.classList?.toggle('sticky__enabled', e.intersectionRatio < 0.5 && isScrolled);
					}
				},
				{ threshold: 0.3, rootMargin: '0%' },
			);
			observer.observe(observePoint.current);
			return () => {
				if (observePoint.current) observer.unobserve(observePoint.current);
				observer.disconnect();
				headerSticky.toggle(true);
			};
		}
	}, [config, currentCategory]);

	useEffect(() => {
		let filtredData = config.data;
		if (!config.diffWith) {
			filtredData = filtredData.filter((p) => comparisonStore.has(p.article));
		}

		let nextData = filtredData;
		if (config.enableCategoryFilter) {
			nextData = currentCategory ? filtredData.filter((p) => p.categories[p.categories.length > 1 ? 1 : 0].name === currentCategory) : filtredData;

			if (nextData.length === 0) {
				setCurrentCategory(null);
				nextData = filtredData;
			}
		}
		setUnfilteredProductsData(filtredData);
		setProductsData(nextData);
		setProductComparisonData(GatherProductComparisonData(nextData, config.diffWith));
		setCurrent(0);
	}, [currentCategory, comparisonStore.productsArticles.length]);

	useEffect(() => {
		if (cardWrapper.current && cardWrapper.current.childNodes.length > 0) {
			itemWidth.current = (cardWrapper.current.childNodes[0] as HTMLDivElement).offsetWidth;
			setSliderLength((cardWrapper.current.offsetWidth - comparisonWrapper.current.offsetWidth) / itemWidth.current);
			return () => {
				window.removeEventListener('mousemove', onDragMove);
				window.removeEventListener('mouseup', onDragMove);
			};
		}
	}, [config, productsData]);

	const onDragStart = (event: React.MouseEvent | React.TouchEvent) => {
		if (cardWrapper.current) {
			cardWrapper.current.style.transition = 'unset';
			rowsRefs.current.forEach((row) => {
				if (row) row.style.transition = 'unset';
			});

			rect = comparisonWrapper.current.getBoundingClientRect();
			const isTouch = (event as React.DragEvent).clientX === undefined;
			const X = (event as React.TouchEvent)?.touches?.[0]?.clientX ?? (event as React.MouseEvent).clientX;
			dragOffset = X - rect.left + itemWidth.current * current;

			if (isTouch) {
				window.addEventListener('touchmove', onDragMove);
				window.addEventListener('touchend', onDragEnd);
			} else {
				window.addEventListener('mousemove', onDragMove);
				window.addEventListener('mouseup', onDragEnd);
			}
		}
	};

	const removeEvents = () => {
		window.removeEventListener('mousemove', onDragMove);
		window.removeEventListener('mouseup', onDragEnd);
		window.removeEventListener('touchmove', onDragMove);
		window.removeEventListener('touchend', onDragEnd);
	};

	const SoftMove = (side: 'next' | 'back') => {
		if (cardWrapper.current) {
			cardWrapper.current.style.transition = 'left 0.5s ease';
			rowsRefs.current.forEach((row) => {
				row.style.transition = 'left 0.5s ease';
			});

			let to = 0;
			if (side === 'next' && current !== sliderLength) {
				if (sliderLength - current < 1 && (sliderLength - current) % 1 > 0) {
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

	const onDragEnd = () => {
		removeEvents();

		if (cardWrapper.current) {
			cardWrapper.current.style.transition = 'left 0.5s ease';
			rowsRefs.current.forEach((row) => {
				row.style.transition = 'left 0.5s ease';
			});

			const slidesPassedRation = (nextOffset * -1) / itemWidth.current - current;
			const slidesPassed = Math.round(slidesPassedRation);

			if (slidesPassed > 0 && current !== sliderLength) {
				setCurrent(current + slidesPassed > sliderLength ? sliderLength : current + slidesPassed);
			} else if (slidesPassed < 0 && current !== 0) {
				setCurrent(current + slidesPassed > 0 ? current + slidesPassed : 0);
			} else {
				const next = `-${itemWidth.current * current}px`;

				rowsRefs.current.forEach((row) => {
					if (row) row.style.left = next;
				});
				cardWrapper.current.style.left = next;
			}
		}
	};

	const onDragMove = (event: MouseEvent | TouchEvent) => {
		if (!rect || !cardWrapper.current) {
			removeEvents();
			return;
		}

		const X = (event as TouchEvent)?.touches?.[0]?.clientX ?? (event as MouseEvent).clientX;
		nextOffset = X - rect.left - dragOffset;

		rowsRefs.current.forEach((row) => {
			row.style.left = `${nextOffset}px`;
		});
		cardWrapper.current.style.left = `${nextOffset}px`;
	};

	const ProductComparisonDataEntries = Object.entries(ProductComparisonData);
	const HasDataToComparison = Object.keys(ProductComparisonDataEntries).length > 0;

	if (!config.diffWith && unfilteredProductsData.length === 0) {
		return <OptionEmptyPage page={'comparison'} />;
	}

	return (
		<div
			className={`comparison__products__wrapper ${
				config.mobileVersion ? 'comparison__products__wrapper__mobile' : 'comparison__products__wrapper__adaptive'
			}`}
		>
			<div className="comparison__products__container" ref={comparisonWrapper}>
				{config.enableCategoryFilter ? (
					<ComparisonProductsCategories data={unfilteredProductsData} setCategory={setCurrentCategory} currentCategory={currentCategory} />
				) : null}
				{productsData.length > 0 ? (
					<>
						<div className="comparison__products__header" ref={headerRef}>
							<div className="comparison__products__card__slider__wrapper">
								<div
									className="comparison__products__card__slider"
									ref={cardWrapper}
									onMouseDown={sliderLength > 0 ? onDragStart : undefined}
									onTouchStart={sliderLength > 0 ? onDragStart : undefined}
									style={{ left: `-${current * itemWidth.current}px` }}
								>
									{productsData.map((product) => {
										return <ComparisonProductsCardBig product={product} config={config} key={`comparison__card__${product.article}`} />;
									})}
								</div>
							</div>

							{sliderLength > 0 ? (
								<>
									<div
										className={`comparison__products__header__arrow comparison__products__header__arrow__left ${
											current > 0 ? 'comparison__products__header__arrow__active' : 'comparison__products__header__arrow__inactive'
										}`}
										onClick={current > 0 ? () => SoftMove('back') : undefined}
									>
										<ArrowIcon className="comparison__products__header__arrow__icon" />
									</div>
									<div
										className={`comparison__products__header__arrow comparison__products__header__arrow__right ${
											current !== sliderLength ? 'comparison__products__header__arrow__active' : 'comparison__products__header__arrow__inactive'
										}`}
										onClick={current !== sliderLength ? () => SoftMove('next') : undefined}
									>
										<ArrowIcon className="comparison__products__header__arrow__icon" />
									</div>
								</>
							) : null}
						</div>
						{HasDataToComparison ? (
							<>
								<StandardBreakLine ref={observePoint} />
								<div
									className="comparison__products__data"
									onMouseDown={sliderLength > 0 ? onDragStart : undefined}
									onTouchStart={sliderLength > 0 ? onDragStart : undefined}
								>
									{ProductComparisonDataEntries.map(([key, bucket], index) => {
										return (
											<Fragment key={`comparison__row__${key}`}>
												<div className="comparison__products__row">
													<p className="comparison__products__row__header">{key}</p>
													<div
														className="comparison__products__row__values"
														ref={(el) => (rowsRefs.current[index] = el as HTMLDivElement)}
														style={{ left: `-${current * itemWidth.current}px` }}
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
							</>
						) : null}
					</>
				) : null}
			</div>
			{HasDataToComparison && config.diffLabels ? (
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
});

export { ComparisonProducts };
