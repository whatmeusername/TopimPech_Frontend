function SmoothScrollToAnchor(anchor: string, duration: number) {
	const target: HTMLElement = document.querySelector(anchor) as HTMLElement;

	if (target) {
		const startPosition = window.pageYOffset;
		const targetPosition = target.offsetTop;
		const distance = targetPosition - startPosition;

		let start: number | null = null;

		const easeInOutQuad = (t: number) => {
			return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
		};

		const step = (timestamp: number) => {
			if (!start) start = timestamp;
			const progress = timestamp - start;
			window.scrollTo(0, startPosition + distance * easeInOutQuad(progress / duration));
			if (progress < duration) {
				window.requestAnimationFrame(step);
			}
		};

		window.requestAnimationFrame(step);
	}
}

export { SmoothScrollToAnchor };
