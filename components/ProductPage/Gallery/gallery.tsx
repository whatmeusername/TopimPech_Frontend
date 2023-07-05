import './gallery.scss';
import { GalleryDesktop } from './Desktop/GalleryDesktop';
import { GalleryItem } from './interface';
import { GalleryMobile } from './Mobile/GalleryMobile';
import { ReactElement, useEffect, useRef } from 'react';
import { useMobile } from '../../../context/MobileContext/MobileContext';

function Gallery({ items, urlStartsWith, ration }: { items: GalleryItem[]; urlStartsWith?: string; ration?: number }): ReactElement {
	const galleryWrapperRef = useRef<HTMLDivElement>(null!);
	const isMobile = useMobile(1024);

	useEffect(() => {
		galleryWrapperRef.current.style.display = 'flex';
	}, []);

	return (
		<div
			className={`gallery__wrapper ${!isMobile ? 'gallery__wrapper__desktop' : 'gallery__wrapper__mobile'}`}
			ref={galleryWrapperRef}
			style={{ display: 'none' }}
		>
			{!isMobile ? (
				<GalleryDesktop items={items} urlStartsWith={urlStartsWith} ration={ration} />
			) : (
				<GalleryMobile items={items} urlStartsWith={urlStartsWith} />
			)}
		</div>
	);
}

export default Gallery;
