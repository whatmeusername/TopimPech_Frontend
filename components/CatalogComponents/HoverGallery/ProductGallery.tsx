import { ReactElement, useRef, useState } from 'react';

import './ProductCardGallery.scss';
import { ProductImage } from '../Cards/interface';

import Image from 'next/image';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { NO_IMAGE_SRC } from '../../const';

const ProductImageGallery = ({
	images,
	urlStartsWith,
	alt,
	size,
}: {
	images: ProductImage[];
	urlStartsWith?: string;
	alt?: string;
	size?: number;
}): ReactElement | null => {
	if (!images) return null;
	const refImages = useRef<ProductImage[]>(images);
	const [selectedImage, setSelectedImage] = useState<number>(0);

	const isMobile = useMobile(768);

	let startX: number;

	function onDragEnd(event: MouseEvent | TouchEvent) {
		const isTouch = (event as DragEvent).clientX === undefined;
		const nextX = (event as TouchEvent)?.touches?.[0]?.clientX ?? (event as MouseEvent).clientX;

		if (nextX - startX < 0) setSelectedImage(selectedImage >= images.length - 1 ? 0 : selectedImage + 1);
		else setSelectedImage(selectedImage <= 0 ? images.length - 1 : selectedImage - 1);

		isTouch ? window.removeEventListener('touchmove', onDragEnd) : window.removeEventListener('mouseup', onDragEnd);
	}

	function onDragStart(event: React.MouseEvent | React.TouchEvent) {
		const isTouch = (event as React.DragEvent).clientX === undefined;
		startX = (event as React.TouchEvent)?.touches?.[0]?.clientX ?? (event as React.MouseEvent).clientX;
		event.preventDefault();

		isTouch ? window.addEventListener('touchmove', onDragEnd) : window.addEventListener('mouseup', onDragEnd);
	}

	const imageSrc = refImages.current[selectedImage]?.path ? `${urlStartsWith ?? ''}${refImages.current[selectedImage].path}` : NO_IMAGE_SRC;
	return (
		<div className="hover__image__gallery__wrapper">
			<div className="gallery__image__wrapper" onTouchStart={isMobile ? onDragStart : undefined} onMouseDown={isMobile ? onDragStart : undefined}>
				<Image
					className="gallery__image"
					src={imageSrc}
					alt={alt ?? ''}
					loading="lazy"
					width={size ?? 400}
					height={size ?? 400}
					style={{ objectFit: 'contain', maxInlineSize: '100%' }}
					onError={(e) => ((e.target as HTMLImageElement).src = NO_IMAGE_SRC)}
				/>
			</div>
			{refImages.current.length > 1 ? (
				<>
					{!isMobile ? (
						<div className="gallery__image__change_zones__wrapper" onMouseLeave={() => setSelectedImage(0)}>
							{refImages.current.map((zone: ProductImage, index: number) => {
								return <span className="gallery__image__change_zone" onMouseEnter={() => setSelectedImage(index)} key={'image-zone-' + zone.name} />;
							})}
						</div>
					) : null}
					<div className="gallery__images__dots">
						{refImages.current.map((dot: ProductImage, index: number) => {
							return (
								<div
									className={`image__dot ${selectedImage === index ? 'image__dot__active' : ''}`}
									data-image_id={index}
									key={'image-dot-' + dot.name}
								/>
							);
						})}
					</div>
				</>
			) : null}
		</div>
	);
};

export default ProductImageGallery;
