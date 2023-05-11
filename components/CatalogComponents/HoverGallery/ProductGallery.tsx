import { useRef, useState } from 'react';

import './ProductCardGallery.scss';
import { ProductImage } from '../Cards/interface';
import useWindowSize from '../../../hooks/useWindowSize';

const ProductImageGallery = ({ images, urlStartsWith }: { images: ProductImage[]; urlStartsWith?: string }): JSX.Element => {
	const refImages = useRef<ProductImage[]>(images);
	const [selectedImage, setSelectedImage] = useState<number>(0);

	const { width } = useWindowSize();

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

		isTouch ? window.addEventListener('touchmove', onDragEnd) : window.addEventListener('mouseup', onDragEnd);
	}

	return (
		<div className="hover__image__gallery__wrapper">
			<div
				className="gallery__image__wrapper"
				onTouchStart={width && width <= 768 ? onDragStart : undefined}
				onMouseDown={width && width <= 768 ? onDragStart : undefined}
			>
				<img className="gallery__image" src={(urlStartsWith ?? '') + refImages.current[selectedImage]?.path} alt="" />
			</div>
			{refImages.current.length > 1 ? (
				<>
					{width && width > 768 ? (
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
