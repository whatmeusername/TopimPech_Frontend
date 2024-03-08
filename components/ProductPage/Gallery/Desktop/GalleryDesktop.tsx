'use client';

import { useState, useRef, useEffect, ReactElement } from 'react';
import { GalleryItem } from '../interface';
import './GalleryDesktop.scss';
import { NO_IMAGE_SRC } from '../../../const';

import Image from 'next/image';

const GalleryDesktop = ({
	items,
	urlStartsWith,
	ration,
	productName,
}: {
	items: GalleryItem[];
	urlStartsWith?: string;
	ration?: number;
	productName: string;
}): ReactElement => {
	const [current, setCurrent] = useState<number>(items[0].id);
	const [allowZoom, setAllowZoom] = useState<boolean>(false);

	const imageWrapper = useRef<HTMLDivElement>(null!);
	const imageBar = useRef<HTMLDivElement>(null!);
	const imageBarList = useRef<HTMLDivElement>(null!);

	const zoomImage = useRef<HTMLImageElement>(null!);
	const zoomPointer = useRef<HTMLDivElement>(null!);
	const imageElement = useRef<HTMLImageElement>(null!);

	const Ration = ration ? ration : 2.5;
	const activeImagePath = `${urlStartsWith ?? ''}${items.find((i) => i.id === current)?.path ?? ''}`;

	let rect: DOMRect = null!;
	const sideTop = useRef<number>(0);

	const OnLoad = () => {
		if (imageWrapper.current.offsetWidth > 0 && imageWrapper.current.offsetHeight > 0) {
			imageElement.current.style.opacity = '1';
			imageElement.current.style.maxWidth = imageWrapper.current.offsetWidth + 'px';
			imageElement.current.style.maxHeight = imageWrapper.current.offsetHeight + 'px';
		} else {
			imageElement.current.style.maxWidth = 'auto';
			imageElement.current.style.maxHeight = 'auto';
		}
		setAllowZoom(imageElement.current.naturalHeight >= 400 && imageElement.current.naturalWidth >= 400 && items.length > 1);
	};

	useEffect(() => {
		OnLoad();
		() => toggleScrollListener('remove');
	}, [imageWrapper.current]);

	const setActiveImage = (id: number): void => {
		setCurrent(id);

		const nextElement: HTMLDivElement = imageBarList.current.querySelector(`[data-image-id="${id}"]`) as HTMLDivElement;

		const nextSibling = nextElement.nextSibling as HTMLDivElement;
		if (nextSibling && imageBar.current.offsetHeight + sideTop.current < nextSibling.offsetTop + nextSibling.offsetHeight) {
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

	const updateImageRectVariable = () => {
		if (imageElement.current) {
			rect = imageElement.current.getBoundingClientRect();
		}
	};

	const toggleScrollListener = (action: 'add' | 'remove') => {
		if (action === 'add') {
			document.addEventListener('scroll', updateImageRectVariable);
		} else if (action === 'remove') {
			document.removeEventListener('scroll', updateImageRectVariable);
		}
	};

	const onEnter = () => {
		zoomImage.current.classList.add('image__zoom__active');
		zoomPointer.current.classList.add('image__zoom__active');

		const w = Ration * imageElement.current.offsetWidth;
		const h = Ration * imageElement.current.offsetHeight;
		zoomImage.current.style.backgroundSize = `${w}px ${h}px`;

		const zoomWidth = (zoomImage.current.offsetWidth / w) * 100;
		const zoomHeight = (zoomImage.current.offsetHeight / h) * 100;
		rect = imageElement.current.getBoundingClientRect();

		zoomPointer.current.style.width = zoomWidth + '%';
		zoomPointer.current.style.height = zoomHeight + '%';
		toggleScrollListener('add');
	};

	const onHover = (e: React.MouseEvent) => {
		if (!rect) return;

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
		toggleScrollListener('remove');
	};

	return (
		<>
			{items.length > 1 ? (
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
									<Image
										className="gallery__available__item__image"
										onError={(e) => {
											const target = e.target as HTMLImageElement;
											target.srcset = NO_IMAGE_SRC;
											target.src = NO_IMAGE_SRC;
										}}
										src={(urlStartsWith ?? '') + item.path}
										alt={productName}
										width={80}
										height={80}
										style={{ objectFit: 'contain', maxInlineSize: '100%' }}
									/>
								</div>
							);
						})}
					</div>
				</div>
			) : null}
			<div className="gallery__current__img__holder__wrapper">
				<div className="gallery__current__img__holder" ref={imageWrapper}>
					<div
						className="gallery__current__img__wrapper"
						itemProp="image"
						onMouseMove={allowZoom ? onHover : undefined}
						onMouseEnter={allowZoom ? onEnter : undefined}
						onMouseLeave={allowZoom ? onHoverLeave : undefined}
					>
						<img
							src={activeImagePath}
							className="gallery__current__img"
							ref={imageElement}
							style={{ opacity: 0 }}
							onLoad={OnLoad}
							onError={(e) => {
								console.log(e);
								const target = e.target as HTMLImageElement;
								target.srcset = NO_IMAGE_SRC;
								target.src = NO_IMAGE_SRC;
							}}
						/>

						{allowZoom ? <div ref={zoomPointer} className="gallery__current__zoom__cursor" /> : null}
					</div>
					<div
						className="gallery__current__img__zoom"
						style={{ background: `url('${activeImagePath}')`, backgroundColor: 'rgb(255, 255, 255)' }}
						ref={zoomImage}
					/>
				</div>
			</div>
		</>
	);
};

export { GalleryDesktop };
