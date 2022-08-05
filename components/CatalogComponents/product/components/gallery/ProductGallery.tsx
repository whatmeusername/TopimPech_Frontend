import { useRef, useState } from 'react';

import styles from './ProductCardGallery.module.scss';
import Image from 'next/image';

import { ProductImage } from '../../interface';

const ProductImageGallery = ({
	images,
	urlStartsWith,
}: {
	images: ProductImage[];
	urlStartsWith?: string;
}): JSX.Element => {
	const refImages = useRef<ProductImage[]>(images);
	const [selectedImage, setSelectedImage] = useState<number>(0);

	return (
		<div className={styles.hover__image__gallery__wrapper}>
			<div className={styles.gallery__image__wrapper}>
				<img
					className={styles.gallery__image}
					src={(urlStartsWith ?? '') + refImages.current[selectedImage]?.path}
					alt=""
				></img>
			</div>
			{refImages.current.length > 1 ? (
				<>
					<div
						className={styles.gallery__image__change_zones__wrapper}
						onMouseLeave={() => setSelectedImage(0)}
					>
						{refImages.current.map((zone: ProductImage, index: number) => {
							return (
								<span
									className={styles.gallery__image__change_zone}
									onMouseEnter={() => setSelectedImage(index)}
									key={'image-zone-' + zone.name}
								></span>
							);
						})}
					</div>
					<div className={styles.gallery__images__dots}>
						{refImages.current.map((dot: ProductImage, index: number) => {
							return (
								<div
									className={`${styles.image__dot} ${
										selectedImage === index ? styles.image__dot__active : ''
									}`}
									data-image_id={index}
									key={'image-dot-' + dot.name}
								></div>
							);
						})}
					</div>
				</>
			) : (
				''
			)}
		</div>
	);
};

export default ProductImageGallery;
