import { Skeleton, SkeletonItem } from './base';

function ProductCardGridSkeleton(): JSX.Element {
	return (
		<Skeleton className="product__card__grid__skeleton">
			<>
				<SkeletonItem className="product__card__grid__image" />
				<SkeletonItem className="product__card__grid__price" />
				<SkeletonItem className="product__card__grid__label" />
				<SkeletonItem className="product__card__grid__cart" />
			</>
		</Skeleton>
	);
}

function ProductCardRowSkeleton(): JSX.Element {
	return (
		<Skeleton className="product__card__row__skeleton">
			<>
				<div className="product__card__row__skeleton__image">
					<SkeletonItem className="product__card__grid__image" />
				</div>
				<div className="product__card__row__skeleton__main">
					<div className="product__card__row__skeleton__info">
						<SkeletonItem className="product__card__grid__label" />
						<SkeletonItem className="product__card__grid__feature" />
						<SkeletonItem className="product__card__grid__feature" />
						<SkeletonItem className="product__card__grid__feature" />
						<SkeletonItem className="product__card__grid__feature" />
						<SkeletonItem className="product__card__grid__feature" />
					</div>
					<div className="product__card__row__skeleton__price">
						<SkeletonItem className="product__card__grid__price" />
						<SkeletonItem className="product__card__grid__cart" />
					</div>
				</div>
			</>
		</Skeleton>
	);
}

function FilterSkeleton(): JSX.Element {
	return (
		<Skeleton className="filters__wrapper__skeleton" transperent={true}>
			<>
				{Array.from(Array(3).keys()).map((i) => {
					return (
						<Skeleton className="filter__wrapper__skeleton" transperent={true} key={'filter-skeleton' + i}>
							<>
								<SkeletonItem className="filter__header" />
								<SkeletonItem className="filter__items" />
							</>
						</Skeleton>
					);
				})}
			</>
		</Skeleton>
	);
}

export { ProductCardGridSkeleton, ProductCardRowSkeleton, FilterSkeleton };
