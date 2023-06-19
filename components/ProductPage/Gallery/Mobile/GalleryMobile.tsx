import { useState, useRef, useEffect } from 'react';
import { GalleryItem } from '../interface';
import './GalleryMobile.scss';

const GalleryMobile = ({ items, urlStartsWith }: { items: GalleryItem[]; urlStartsWith?: string }): JSX.Element | null => {
	const [current, setCurrent] = useState<number>(items[0].id);

	const dragWrapper = useRef<HTMLDivElement>(null!);

	const maxIndex = items.length - 1;

	let dragOffset = 0;
	let rect: DOMRect | null = null;
	let nextOffset = 0;

	useEffect(() => {
		dragWrapper.current.style.left = `-${current * dragWrapper.current.offsetWidth}px`;
	}, [current]);

	const OnDragStart = (e: React.DragEvent | React.TouchEvent): void => {
		dragWrapper.current.style.transition = 'unset';

		const isTouch = (e as React.DragEvent).clientX === undefined;

		if (!isTouch) {
			e.preventDefault();
		}
		const x = (e as React.DragEvent).clientX ?? (e as React.TouchEvent).touches[0].clientX;

		rect = dragWrapper.current.getBoundingClientRect();
		dragOffset = x - rect.left + dragWrapper.current.offsetWidth * current;

		window.addEventListener('mousemove', onDragMove);
		window.addEventListener('mouseup', onDragEnd);

		if (isTouch) {
			window.addEventListener('touchmove', onDragMove);
			window.addEventListener('touchend', onDragEnd);
		} else {
			window.addEventListener('mousemove', onDragMove);
			window.addEventListener('mouseup', onDragEnd);
		}
	};

	const removeEvents = (): void => {
		window.removeEventListener('touchmove', onDragMove);
		window.removeEventListener('touchend', onDragEnd);
		window.removeEventListener('mousemove', onDragMove);
		window.removeEventListener('mouseup', onDragEnd);
	};

	const onDragMove = (event: MouseEvent | TouchEvent): void => {
		if (!rect) {
			removeEvents();
			return;
		}
		const x = (event as TouchEvent)?.touches?.[0].clientX ?? (event as MouseEvent).clientX;
		nextOffset = x - rect.left - dragOffset;
		dragWrapper.current.style.left = `${nextOffset}px`;
	};

	const onDragEnd = () => {
		removeEvents();

		dragWrapper.current.style.transition = 'left 0.25s ease';

		const slidesPassedRation = (nextOffset * -1) / dragWrapper.current.offsetWidth - current;
		const slidesPassed = Math.round(slidesPassedRation);

		if (slidesPassed > 0 && current !== maxIndex) {
			setCurrent(current + slidesPassed > maxIndex ? maxIndex : current + slidesPassed);
		} else if (slidesPassed < 0 && current !== 0) {
			setCurrent(current + slidesPassed > 0 ? current + slidesPassed : 0);
		} else {
			dragWrapper.current.style.left = `-${dragWrapper.current.offsetWidth * current}px`;
		}
	};

	return (
		<>
			<div className="gallery__images__holder__wrapper">
				<div className="gallery__images__holder" onDragStart={OnDragStart} onTouchStart={OnDragStart} ref={dragWrapper}>
					{items.map((item) => {
						return (
							<span className="gallery__image__holder" key={`gallery__image__holder__${item.id}`}>
								<img src={(urlStartsWith ?? '') + item.path} className="gallery__current__image" alt={item.path} />
							</span>
						);
					})}
				</div>
			</div>
			<div className="gallery__available__items__wrapper">
				<div className="gallery__available__items">
					{items.map((item) => {
						return (
							<div
								key={`gallery__item__${item.id}`}
								onClick={() => setCurrent(item.id)}
								className={`gallery__available__item ${
									current === item.id ? 'gallery__available__item__selected' : 'gallery__available__item__inactive'
								}`}
							>
								<img src={(urlStartsWith ?? '') + item.path} className="gallery__available__item__image" />
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export { GalleryMobile };
