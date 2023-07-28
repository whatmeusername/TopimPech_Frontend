import { useState, useRef, useEffect } from 'react';
import { GalleryItem } from '../interface';
import './GalleryDesktop.scss';
import { NO_IMAGE_SRC } from '../../../const';

const GalleryDesktop = ({ items, urlStartsWith, ration }: { items: GalleryItem[]; urlStartsWith?: string; ration?: number }): JSX.Element => {
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
		imageElement.current.style.display = 'unset';
		if (imageWrapper.current.offsetWidth > 0 && imageWrapper.current.offsetHeight > 0) {
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
	}, [current]);

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
	};

	return (
		<>
			<div className="gallery__available__items__wrapper" ref={imageBar}>
				{items.length > 1 ? (
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
									<img
										src={(urlStartsWith ?? '') + item.path}
										alt={item.path}
										className="gallery__available__item__image"
										onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
									/>
								</div>
							);
						})}
					</div>
				) : null}
			</div>
			<div className="gallery__current__img__holder__wrapper">
				<div className="gallery__current__img__holder" ref={imageWrapper}>
					<div
						className="gallery__current__img__wrapper"
						onMouseMove={allowZoom ? onHover : undefined}
						onMouseEnter={allowZoom ? onEnter : undefined}
						onMouseLeave={allowZoom ? onHoverLeave : undefined}
					>
						<img
							src={activeImagePath}
							alt={activeImagePath}
							className="gallery__current__img"
							ref={imageElement}
							style={{ display: 'none' }}
							onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
						/>
						{allowZoom ? <div ref={zoomPointer} className="gallery__current__zoom__cursor" /> : null}
					</div>
					<div className="gallery__current__img__zoom" style={{ background: `url('${activeImagePath}')` }} ref={zoomImage} />
				</div>
			</div>
		</>
	);
};

export { GalleryDesktop };
