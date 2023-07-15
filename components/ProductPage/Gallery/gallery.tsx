import './gallery.scss';
import { GalleryDesktop } from './Desktop/GalleryDesktop';
import { GalleryItem } from './interface';
import { GalleryMobile } from './Mobile/GalleryMobile';
import { ReactElement, useEffect, useRef } from 'react';
import { useMobile } from '../../../context/MobileContext/MobileContext';
import { NO_IMAGE_SRC } from '../../const';

const GalleryNoImage = () => {
	return (
		<div className="gallery__current__no__image gallery__wrapper">
			<div className="gallery__current__img__wrapper">
				<img src={NO_IMAGE_SRC} className="gallery__no__img" />
			</div>
		</div>
	);
};

function Gallery({ items, urlStartsWith, ration }: { items: GalleryItem[]; urlStartsWith?: string; ration?: number }): ReactElement {
	const galleryWrapperRef = useRef<HTMLDivElement>(null!);
	const isMobile = useMobile(1024);

	useEffect(() => {
		galleryWrapperRef.current.style.display = 'flex';
	}, []);

	return (
		<div
			className={`gallery__wrapper ${!isMobile ? 'gallery__wrapper__desktop' : 'gallery__wrapper__mobile'} ${
				items.length === 0 ? 'gallery__wrapper__noimage' : ''
			}`}
			ref={galleryWrapperRef}
			style={{ display: 'none' }}
		>
			{items.length === 0 ? (
				<GalleryNoImage />
			) : !isMobile ? (
				<GalleryDesktop items={items} urlStartsWith={urlStartsWith} ration={ration} />
			) : (
				<GalleryMobile items={items} urlStartsWith={urlStartsWith} />
			)}
		</div>
	);
}

export default Gallery;
