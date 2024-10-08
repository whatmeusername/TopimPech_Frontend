import { useState, useEffect, useRef } from 'react';

interface WindowSize {
	width: number | undefined;
	height: number | undefined;
}

export default function useWindowSize(): { width: number | undefined; height: number | undefined } {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: undefined,
		height: undefined,
	});

	const debounce = useRef<boolean>(false);

	useEffect(() => {
		function handleResize() {
			if (debounce.current === false) {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
				setTimeout(() => {
					debounce.current = false;
				}, 200);
			}
			debounce.current = true;
		}

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
}
