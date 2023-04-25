import { useState, useEffect, useRef } from 'react';

import './gallery.scss';
import { GalleryDesktop } from './GalleryDesktop';
import { GalleryItem } from './interface';
import { GalleryMobile } from './GalleryMobile';

function Gallery({ items, urlStartsWith, ration }: { items: GalleryItem[]; urlStartsWith?: string; ration?: number }): JSX.Element | null {
	if (typeof window === 'undefined' || window.innerWidth > 1024) {
		return <GalleryDesktop items={items} urlStartsWith={urlStartsWith} ration={ration} />;
	} else {
		return <GalleryMobile items={items} urlStartsWith={urlStartsWith} />;
	}
}

export default Gallery;
