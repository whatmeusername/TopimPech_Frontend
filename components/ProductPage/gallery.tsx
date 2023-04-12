import { useState, useEffect, useRef } from 'react';

import './gallery.scss';

interface GalleryItem {
	path: string;
	id: number;
}

const GalleryDesktop = ({
	items,
	urlStartsWith,
	ration,
}: {
	items: GalleryItem[];
	urlStartsWith?: string;
	ration?: number;
}): JSX.Element => {
	const [current, setCurrent] = useState<number>(items[0].id);

	const imageWrapper = useRef<HTMLDivElement>(null!);
	const imageBar = useRef<HTMLDivElement>(null!);
	const imageBarList = useRef<HTMLDivElement>(null!);

	const zoomImage = useRef<HTMLImageElement>(null!);
	const zoomPointer = useRef<HTMLDivElement>(null!);
	const imageElement = useRef<HTMLImageElement>(null!);

	const Ration = ration === undefined ? 2.5 : ration;

	const OnLoad = () => {
		imageElement.current.style.maxWidth = imageWrapper.current.offsetWidth + 'px';
		imageElement.current.style.maxHeight = imageWrapper.current.offsetHeight + 'px';
	};

	useEffect(() => {
		OnLoad();
	}, []);

	let zoomWidth = 0;
	let zoomHeight = 0;
	let rect: DOMRect = null!;
	const sideTop = useRef<number>(0);

	const setActiveImage = (id: number): void => {
		setCurrent(id);

		const nextElement: HTMLDivElement = imageBarList.current.querySelector(`[data-image-id="${id}"]`) as HTMLDivElement;

		const nextSibling = nextElement.nextSibling as HTMLDivElement;
		if (
			nextSibling &&
			imageBar.current.offsetHeight + sideTop.current < nextSibling.offsetTop + nextSibling.offsetHeight
		) {
			sideTop.current = nextSibling.offsetHeight + (nextSibling.offsetTop - imageBar.current.offsetHeight);
			imageBarList.current.style.top = -1 * sideTop.current + 'px';
		} else {
			const previousSibling = nextElement.previousSibling as HTMLDivElement;
			if (previousSibling && sideTop.current >= previousSibling.offsetTop) {
				sideTop.current = previousSibling.offsetTop;
				imageBarList.current.style.top = -1 * sideTop.current + 'px';
			}
		}
	};

	const onEnter = () => {
		zoomImage.current.classList.add('image__zoom__active');
		zoomPointer.current.classList.add('image__zoom__active');

		const w = Ration * imageElement.current.offsetWidth;
		const h = Ration * imageElement.current.offsetHeight;
		zoomImage.current.style.backgroundSize = `${w}px ${h}px`;

		zoomWidth = (zoomImage.current.offsetWidth / w) * 100;
		zoomHeight = (zoomImage.current.offsetHeight / h) * 100;
		rect = imageElement.current.getBoundingClientRect();

		zoomPointer.current.style.width = zoomWidth + '%';
		zoomPointer.current.style.height = zoomHeight + '%';
	};

	const onHover = (e: React.MouseEvent) => {
		let newPointerX = e.clientX - rect.left - zoomPointer.current.offsetWidth / 2;
		let newPointerY = e.clientY - rect.top - zoomPointer.current.offsetHeight / 2;

		const maxX = imageElement.current.offsetWidth - zoomPointer.current.offsetWidth;
		const maxY = imageElement.current.offsetHeight - zoomPointer.current.offsetHeight;

		newPointerX = newPointerX < 0 ? 0 : newPointerX > maxX ? maxX : newPointerX;
		newPointerY = newPointerY < 0 ? 0 : newPointerY > maxY ? maxY : newPointerY;

		zoomPointer.current.style.left = newPointerX + 'px';
		zoomPointer.current.style.top = newPointerY + 'px';

		zoomImage.current.style.backgroundPosition = `-${Ration * newPointerX}px -${Ration * newPointerY}px`;
	};

	const onHoverLeave = () => {
		zoomImage.current.classList.remove('image__zoom__active');
		zoomPointer.current.classList.remove('image__zoom__active');
	};

	const activeImagePath = (urlStartsWith ?? '') + (items.find((i) => i.id === current)?.path ?? '');

	return (
		<div className="gallery__wrapper gallery__wrapper__desktop">
			<div className="gallery__available__items__wrapper" ref={imageBar}>
				<div className="gallery__available__items" ref={imageBarList}>
					{items.map((item) => {
						return (
							<div
								className={`gallery__available__item ${
									current === item.id ? 'gallery__available__item__selected' : 'gallery__available__item__inactive'
								}`}
								key={`gallery__item__${item.id}`}
								onClick={() => setActiveImage(item.id)}
								data-image-id={item.id}
							>
								<img src={(urlStartsWith ?? '') + item.path} alt="" className="gallery__available__item__image" />
							</div>
						);
					})}
				</div>
			</div>
			<div className="gallery__current__img__holder__wrapper">
				<div className="gallery__current__img__holder">
					<div
						className="gallery__current__img__wrapper"
						onMouseMove={onHover}
						onMouseEnter={onEnter}
						onMouseLeave={onHoverLeave}
						ref={imageWrapper}
					>
						<img src={activeImagePath} alt="" className="gallery__current__img" ref={imageElement} />
						<div ref={zoomPointer} className="gallery__current__zoom__cursor" />
					</div>
					<div
						className="gallery__current__img__zoom"
						style={{ background: `url(${activeImagePath})` }}
						ref={zoomImage}
					/>
				</div>
			</div>
		</div>
	);
};

const GalleryMobile = ({
	items,
	urlStartsWith,
}: {
	items: GalleryItem[];
	urlStartsWith?: string;
}): JSX.Element | null => {
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

function Gallery({
	items,
	urlStartsWith,
	ration,
}: {
	items: GalleryItem[];
	urlStartsWith?: string;
	ration?: number;
}): JSX.Element | null {
	if (typeof window === 'undefined' || window.innerWidth > 1024) {
		return <GalleryDesktop items={items} urlStartsWith={urlStartsWith} ration={ration} />;
	} else {
		return <GalleryMobile items={items} urlStartsWith={urlStartsWith} />;
	}
}

export default Gallery;
