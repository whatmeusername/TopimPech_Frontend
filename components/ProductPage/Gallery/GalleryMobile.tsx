import { useState, useRef, useEffect } from 'react';
import { GalleryItem } from './interface';

const GalleryMobile = ({ items, urlStartsWith }: { items: GalleryItem[]; urlStartsWith?: string }): JSX.Element | null => {
	const [current, setCurrent] = useState<number>(items[0].id);

	const dragWrapper = useRef<HTMLDivElement>(null!);

	let dragOffset = 0;
	let rect: DOMRect | null = null;
	let currentOffset = 0;
	let nextOffset = 0;

	useEffect(() => {
		dragWrapper.current.style.left = current * dragWrapper.current.offsetWidth * -1 + 'px';
	}, [current]);

	const OnDragStart = (e: React.DragEvent | React.TouchEvent) => {
		const isTouch = (e as React.DragEvent).clientX === undefined;

		if (!isTouch) {
			e.preventDefault();
		}
		const x = (e as React.DragEvent).clientX ?? (e as React.TouchEvent).touches[0].clientX;

		rect = dragWrapper.current.getBoundingClientRect();
		currentOffset = dragWrapper.current.offsetWidth * current;
		dragOffset = x - rect.left + currentOffset;
		dragWrapper.current.style.transition = '';

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

	const removeEvents = () => {
		window.removeEventListener('touchmove', onDragMove);
		window.removeEventListener('touchend', onDragEnd);
		window.removeEventListener('mousemove', onDragMove);
		window.removeEventListener('mouseup', onDragEnd);
	};

	const onDragMove = (e: MouseEvent | TouchEvent) => {
		if (!rect) {
			removeEvents();
			return;
		}

		const x = (e as DragEvent).clientX ?? (e as TouchEvent).touches[0].clientX;
		const next = x - rect.left - dragOffset;

		dragWrapper.current.style.left = next + 'px';
		nextOffset = next;
	};

	const onDragEnd = () => {
		removeEvents();

		dragWrapper.current.style.transition = 'left 0.25s ease';

		const ratioNext = (nextOffset * -1) / dragWrapper.current.offsetWidth;
		let idNext = Math.trunc(ratioNext);

		if (ratioNext > current + 0.5) {
			idNext = ratioNext > idNext + 0.5 ? Math.ceil(ratioNext) : idNext;
		} else if (ratioNext + 0.5 < current) {
			idNext = ratioNext < idNext + 0.5 ? Math.floor(ratioNext) : Math.floor(ratioNext);
		} else {
			dragWrapper.current.style.left = `-${dragWrapper.current.offsetWidth * current}px`;
			return;
		}

		if (ratioNext < 0) {
			if (current !== 0) setCurrent(0);
			else dragWrapper.current.style.left = '0px';
		} else if (idNext < current) {
			setCurrent(idNext === 0 ? 0 : current - (current - idNext));
		} else if (idNext >= items.length - 2) {
			if (current !== items.length - 1) setCurrent(items.length - 1);
			else dragWrapper.current.style.left = `-${dragWrapper.current.offsetWidth * (items.length - 1)}px`;
		} else if (idNext > current) setCurrent(current + (idNext - current));
	};

	return (
		<div className="gallery__wrapper gallery__wrapper__mobile">
			<div className="gallery__images__holder__wrapper">
				<div className="gallery__images__holder" onDragStart={OnDragStart} onTouchStart={OnDragStart} ref={dragWrapper}>
					{items.map((item) => {
						return (
							<span className="gallery__image__holder" key={`gallery__image__holder__${item.id}`}>
								<img src={(urlStartsWith ?? '') + item.path} className="gallery__current__image" alt="" />
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
		</div>
	);
};

export { GalleryMobile };
