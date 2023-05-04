import './gallery.scss';
import { GalleryDesktop } from './Desktop/GalleryDesktop';
import { GalleryItem } from './interface';
import { GalleryMobile } from './Mobile/GalleryMobile';
import useWindowSize from '../../../hooks/useWindowSize';
import { ReactElement, useEffect, useRef, useState } from 'react';

function Gallery({ items, urlStartsWith, ration }: { items: GalleryItem[]; urlStartsWith?: string; ration?: number }): ReactElement {
	const galleryWrapperRef = useRef<HTMLDivElement>(null!);
	const { width } = useWindowSize();
	const [isMobile, setIsMobile] = useState<boolean>(false);

	useEffect(() => {
		setIsMobile(window.innerWidth <= 1024);
		galleryWrapperRef.current.style.display = 'flex';
	}, [width]);

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
