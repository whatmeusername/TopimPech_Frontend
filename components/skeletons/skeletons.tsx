import { Skeleton, SkeletonItem } from './base';
import styles from './skeletons.module.scss';

function ProductCardGridSkeleton(): JSX.Element {
	return (
		<Skeleton className={styles.product__card__grid__skeleton}>
			<>
				<SkeletonItem className={styles.product__card__grid__image} />
				<SkeletonItem className={styles.product__card__grid__price} />
				<SkeletonItem className={styles.product__card__grid__label} />
				<SkeletonItem className={styles.product__card__grid__cart} />
			</>
		</Skeleton>
	);
}

function ProductCardRowSkeleton(): JSX.Element {
	return (
		<Skeleton className={styles.product__card__row__skeleton}>
			<>
				<div className={styles.product__card__row__skeleton__image}>
					<SkeletonItem className={styles.product__card__grid__image} />
				</div>
				<div className={styles.product__card__row__skeleton__main}>
					<div className={styles.product__card__row__skeleton__info}>
						<SkeletonItem className={styles.product__card__grid__label} />
						<SkeletonItem className={styles.product__card__grid__feature} />
						<SkeletonItem className={styles.product__card__grid__feature} />
						<SkeletonItem className={styles.product__card__grid__feature} />
						<SkeletonItem className={styles.product__card__grid__feature} />
						<SkeletonItem className={styles.product__card__grid__feature} />
					</div>
					<div className={styles.product__card__row__skeleton__price}>
						<SkeletonItem className={styles.product__card__grid__price} />
						<SkeletonItem className={styles.product__card__grid__cart} />
					</div>
				</div>
			</>
		</Skeleton>
	);
}

function FilterSkeleton(): JSX.Element {
	let skelteonsCount = Array.from(Array(3).keys());
	return (
		<Skeleton className={styles.filters__wrapper__skeleton} transperent={true}>
			<>
				{skelteonsCount.map((i) => {
					return (
						<Skeleton
							className={styles.filter__wrapper__skeleton}
							transperent={true}
							key={'filter-skeleton' + i}
						>
							<>
								<SkeletonItem className={styles.filter__header} />
								<SkeletonItem className={styles.filter__items} />
							</>
						</Skeleton>
					);
				})}
			</>
		</Skeleton>
	);
}

export { ProductCardGridSkeleton, ProductCardRowSkeleton, FilterSkeleton };
