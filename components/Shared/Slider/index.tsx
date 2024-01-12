import { useRef, useState, useEffect, ReactElement } from 'react';
import './Slider.scss';

import { useMobile } from '../../../context/MobileContext/MobileContext';
import { ArrowIcon } from '../../IconsElements';
import useWindowSize from '../../../hooks/useWindowSize';

const ACTIVE_DOT_CLASSNAME = 'slider__dot__active';
const DISABLED_BUTTON_CLASSNAME = 'slider__button__disabled';

interface SliderSettings {
	ItemsPerSlide?: number | 'auto';
	mobileSize?: number;
	buttons?: {
		enabled?: boolean;
		disableWhen?: number;
	};
	returnToOtherSide?: boolean;
	dots?: {
		enabled?: boolean;
	};
	disableMobileVersion?: boolean;
	auto?: {
		// direction?: SlideDirection;
		timeMS: number;
	};
}

enum SlideDirection {
	LEFT = 'left',
	RIGHT = 'right',
}

function GetButtonsEnableInitialState(options: SliderSettings, screenWidth?: number, itemsCount?: number): boolean {
	if (screenWidth && options?.buttons && options.buttons?.disableWhen && options.buttons.disableWhen >= screenWidth) return false;
	else if (itemsCount === 0) return false;
	else return options?.buttons?.enabled ?? true;
}

function GetDotsInitialState(options: SliderSettings, itemsCount?: number) {
	if (options?.dots && options?.dots?.enabled) return options.dots.enabled;
	else if (itemsCount !== undefined) return itemsCount > 0;
	else return true;
}

function ButtonVersionSlider({ children, options = {} }: { children: ReactElement[]; options?: SliderSettings }) {
	const { width } = useWindowSize();
	const isSingleSlide = options?.ItemsPerSlide === 1;

	const [current, setCurrent] = useState<number>(0);

	const slideTimer = useRef<ReturnType<typeof setTimeout>>(null!);

	const dotsRef = useRef<HTMLDivElement>(null!);
	const wrapperRef = useRef<HTMLDivElement>(null!);
	const contentRef = useRef<HTMLDivElement>(null!);

	const [LBDisabled, setLBDisabled] = useState<boolean>(options?.returnToOtherSide ? false : true);
	const [RBDisabled, setRBDisabled] = useState<boolean>(false);

	const currentSlide = useRef<number>(0);
	const sliderMaxWidth = useRef<number>(0);
	const slidesTotal = useRef<number>(isSingleSlide ? children.length - 1 : 0);

	const [itemsCount, setItemsCount] = useState<number>(-1);
	const itemsPerSlide = useRef<number>(options?.ItemsPerSlide === 'auto' ? null! : options?.ItemsPerSlide ?? null!);
	const itemWidth = useRef<number>(0);

	// DOTS
	const DOTS_COUNT = (isSingleSlide ? slidesTotal.current : Math.ceil(itemsCount / (itemsPerSlide.current ?? 1))) + 1;
	const dots = Array.from(Array(DOTS_COUNT).keys());

	// ACTIVE STATES
	const IS_BUTTON_ACTIVE = useRef<boolean>(GetButtonsEnableInitialState(options, width));
	const IS_DOTS_ACTIVE = useRef<boolean>(GetDotsInitialState(options, slidesTotal.current));

	let dragOffset = 0;
	let rect: DOMRect | null = null;
	let nextOffset: number | null = null;

	function setSliderTimeout() {
		if (options?.auto) {
			slideTimer.current = setTimeout(() => {
				SlideToBySide(SlideDirection.RIGHT, itemsPerSlide.current);
			}, options.auto.timeMS);
		}
	}

	function clearSliderTimeout(reset: boolean) {
		if (options?.auto) {
			if (slideTimer.current) {
				clearTimeout(slideTimer.current);
				slideTimer.current = null!;
			}
			if (reset) {
				setSliderTimeout();
			}
		}
	}

	const OnDragStart = (e: React.DragEvent | React.TouchEvent): void => {
		contentRef.current.style.transition = 'unset';

		const isTouch = (e as React.DragEvent).clientX === undefined;

		if (!isTouch) {
			e.preventDefault();
		}
		const x = (e as React.DragEvent).clientX ?? (e as React.TouchEvent).touches[0].clientX;

		rect = wrapperRef.current.getBoundingClientRect();
		dragOffset = x - rect.left + wrapperRef.current.offsetWidth * current;

		window.addEventListener('mousemove', onDragMove);
		window.addEventListener('mouseup', onDragEnd);

		if (isTouch) {
			window.addEventListener('touchmove', onDragMove);
			window.addEventListener('touchend', onDragEnd);
		} else {
			window.addEventListener('mousemove', onDragMove);
			window.addEventListener('mouseup', onDragEnd);
		}
		clearSliderTimeout(false);
	};

	const removeEvents = (): void => {
		window.removeEventListener('touchmove', onDragMove);
		window.removeEventListener('touchend', onDragEnd);
		window.removeEventListener('mousemove', onDragMove);
		window.removeEventListener('mouseup', onDragEnd);
	};

	const onDragMove = (event: MouseEvent | TouchEvent): void => {
		if (!rect) {
			removeEvents();
			return;
		}
		const x = (event as TouchEvent)?.touches?.[0].clientX ?? (event as MouseEvent).clientX;

		nextOffset = x - rect.left - dragOffset;
		contentRef.current.style.left = `${nextOffset}px`;
	};

	const onDragEnd = () => {
		removeEvents();
		if (nextOffset === null) return;

		contentRef.current.style.transition = 'left 0.25s ease';

		const slidesPassedRation = (nextOffset * -1) / itemWidth.current - current;
		const slidesPassed = Math.round(slidesPassedRation);

		if (slidesPassed > 0 && current !== itemsCount) {
			SlideTo(current + slidesPassed > itemsCount ? itemsCount : current + slidesPassed);
		} else if (slidesPassed < 0 && current !== 0) {
			SlideTo(current + slidesPassed > 0 ? current + slidesPassed : 0);
		} else {
			contentRef.current.style.left = `-${itemWidth.current * current}px`;
		}
	};

	useEffect(() => {
		if (contentRef.current.childNodes.length === 0) return;

		const wrapperInnerWidth = wrapperRef.current.offsetWidth;
		const contentItems = contentRef.current.childNodes;

		itemWidth.current = (contentItems[0] as HTMLElement).offsetWidth;
		itemsPerSlide.current = itemsPerSlide.current === null ? Math.floor(wrapperInnerWidth / itemWidth.current) : itemsPerSlide.current;

		const itemsCount = contentItems.length - itemsPerSlide.current;

		slidesTotal.current = Math.ceil(itemsCount / itemsPerSlide.current);
		contentRef.current.style.width = `${contentItems.length * wrapperInnerWidth}px`;
		sliderMaxWidth.current = contentItems.length * itemWidth.current - wrapperInnerWidth;

		IS_BUTTON_ACTIVE.current = GetButtonsEnableInitialState(options, width, itemsCount);
		IS_DOTS_ACTIVE.current = GetDotsInitialState(options, slidesTotal.current);

		setItemsCount(itemsCount);
		validateButtons(itemsCount);
	}, [width]);

	useEffect(() => {
		if (itemsCount > 0 && options?.auto) {
			setSliderTimeout();
			return () => {
				clearSliderTimeout(false);
			};
		}
	}, [itemsCount]);

	useEffect(() => {
		contentRef.current.style.left = `-${
			itemWidth.current * current > sliderMaxWidth.current ? sliderMaxWidth.current : itemWidth.current * current
		}px`;
	}, [current]);

	const SlideToBySide = (side: SlideDirection, to?: number): void => {
		const itemsToSlide = to ? to : 1;

		if (side === SlideDirection.RIGHT) {
			const last = options?.returnToOtherSide && currentSlide.current === slidesTotal.current ? 0 : itemsCount;
			const lastDot = options?.returnToOtherSide && currentSlide.current === slidesTotal.current ? 0 : slidesTotal.current;

			// GETTING CURRENT SLIDE ITEM

			setCurrent((c) => (itemsCount >= c + itemsToSlide ? c + itemsToSlide : last));

			// GETTING CURRENT SLIDE
			const nextSlide = currentSlide.current + 1 <= slidesTotal.current ? currentSlide.current + 1 : lastDot;
			setActiveDot(currentSlide.current + 1 <= slidesTotal.current ? currentSlide.current + 1 : lastDot);
			currentSlide.current = nextSlide;
		} else if (side === SlideDirection.LEFT) {
			const first = options?.returnToOtherSide && currentSlide.current === 0 ? itemsCount : 0;
			const firstDot = options?.returnToOtherSide && currentSlide.current === 0 ? slidesTotal.current : 0;

			// GETTING CURRENT SLIDE ITEM
			setCurrent((c) => (c - itemsToSlide >= 0 ? c - itemsToSlide : first));

			// GETTING CURRENT SLIDE
			const nextSlide = current - itemsToSlide >= 0 ? currentSlide.current - 1 : firstDot;
			setActiveDot(nextSlide);
			currentSlide.current = nextSlide;
		}
		validateButtons();
		clearSliderTimeout(true);
	};

	const SlideTo = (to: number): void => {
		if (current !== to) {
			if (to < 0) to = 0;
			else if (to > itemsCount) to = itemsCount;

			clearSliderTimeout(true);
			setCurrent(to);
			findDotAndSetActive(to);
			validateButtons();
		}
	};

	const validateButtons = (currentCount?: number) => {
		currentCount = currentCount ?? itemsCount;
		if (!IS_BUTTON_ACTIVE.current) {
			setLBDisabled(true);
			setRBDisabled(true);
		} else if (options?.returnToOtherSide && currentCount > 0) return;
		else {
			setLBDisabled(currentSlide.current === 0);
			setRBDisabled(currentSlide.current === slidesTotal.current);
		}
	};

	const findDotAndSetActive = (to: number) => {
		if (dotsRef.current && IS_DOTS_ACTIVE.current) {
			const dots = dotsRef.current.childNodes as NodeListOf<HTMLElement>;
			for (let i = 0; i < dots.length; i++) {
				const dot = dots[i];
				const slidesNumber = Number(dot.dataset.slides);
				if (to <= slidesNumber) {
					dots[currentSlide.current]?.classList.remove(ACTIVE_DOT_CLASSNAME);
					dots[i]?.classList.add(ACTIVE_DOT_CLASSNAME);
					currentSlide.current = i;
					break;
				}
			}
		}
	};

	const setActiveDot = (nextSlide: number) => {
		if (IS_DOTS_ACTIVE && dotsRef.current) {
			const dots = dotsRef.current.childNodes as NodeListOf<HTMLElement>;
			dots[currentSlide.current]?.classList.remove(ACTIVE_DOT_CLASSNAME);
			dots[nextSlide]?.classList.add(ACTIVE_DOT_CLASSNAME);
		}
	};

	const SliderButton = ({ side }: { side: SlideDirection }): ReactElement => {
		const isDisabledSide = side === SlideDirection.LEFT ? LBDisabled : RBDisabled;
		const sideClass = side === SlideDirection.LEFT ? 'slider__content__slide__button__left' : 'slider__content__slide__button__right';

		return (
			<button
				className={`${isDisabledSide ? DISABLED_BUTTON_CLASSNAME : ''} slider__content__slide__button ${sideClass}`}
				onClick={isDisabledSide ? undefined : () => SlideToBySide(side, itemsPerSlide.current)}
				title={`переключиться на ${side === SlideDirection.LEFT ? 'левый' : 'правый'} слайд`}
			>
				<ArrowIcon className={`slider__content__slide__icon ${sideClass}`} />
			</button>
		);
	};

	const DotsElement = (): JSX.Element => {
		return (
			<div className="slider__dots__wrapper" ref={dotsRef}>
				{dots.map((dot) => {
					const slides = itemsPerSlide.current * dot <= itemsCount ? itemsPerSlide.current * dot : itemsCount;
					return (
						<span
							className={`slider__dot ${dot === currentSlide.current ? ACTIVE_DOT_CLASSNAME : ''} slider__dot__button`}
							key={'slider-dot-' + dot}
							data-slides={slides}
							onClick={() => SlideTo(slides)}
						/>
					);
				})}
			</div>
		);
	};

	return (
		<div className="slider__wrapper slider__wrapper__carousel" ref={wrapperRef}>
			<div
				className={`slider__main__content ${slidesTotal.current === 0 ? 'slider__main__content__single__slide' : ''} ${
					children.length === 1 ? 'slider__main__content__single__child' : ''
				}`}
			>
				{IS_BUTTON_ACTIVE.current && !LBDisabled ? <SliderButton side={SlideDirection.LEFT} /> : null}
				<div className="slider__content__wrapper">
					<div
						className="slider__content"
						ref={contentRef}
						onDragStart={isSingleSlide ? OnDragStart : undefined}
						onTouchStart={isSingleSlide ? OnDragStart : undefined}
						style={{ width: '9999px', left: '0px' }}
					>
						{children}
					</div>
					{IS_DOTS_ACTIVE.current ? <DotsElement /> : null}
				</div>
				{IS_BUTTON_ACTIVE.current && !RBDisabled ? <SliderButton side={SlideDirection.RIGHT} /> : null}
			</div>
		</div>
	);
}

function DragVersionSlider({ children }: { children: ReactElement | ReactElement[] }) {
	const contentWrapperRef = useRef<HTMLDivElement>(null!);
	const contentRef = useRef<HTMLDivElement>(null!);

	let clientStart = 0;
	let wrapperOffsetLeft = 0;
	let wrapperLeftScroll = 0;

	const DragStart = (event: React.MouseEvent) => {
		wrapperOffsetLeft = contentWrapperRef.current.offsetLeft;
		wrapperLeftScroll = contentWrapperRef.current.scrollLeft;

		clientStart = event.clientX - wrapperOffsetLeft;
		window.addEventListener('mousemove', DragMove);
		window.addEventListener('mouseup', DragEnd);
	};

	const DragEnd = () => {
		window.removeEventListener('mousemove', DragMove);
		window.removeEventListener('mouseup', DragMove);
	};

	const DragMove = (event: MouseEvent) => {
		const next = (event.clientX - wrapperOffsetLeft - clientStart) * 2;
		contentWrapperRef.current.scrollLeft = wrapperLeftScroll - next;
	};

	return (
		<div className="slider__wrapper slider__wrapper__drag">
			<div className="slider__main__content">
				<div
					className={`slider__content__wrapper ${
						(Array.isArray(children) ? children.length === 1 : true) ? 'slider__main__content__single__child' : ''
					}`}
					ref={contentWrapperRef}
					onMouseDown={DragStart}
				>
					<div className="slider__content" ref={contentRef}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

function Slider({ children, SliderSettings }: { children: ReactElement[]; SliderSettings?: SliderSettings }) {
	const isMobile = SliderSettings?.disableMobileVersion ? false : useMobile(SliderSettings?.mobileSize ?? 720);
	if (!isMobile) {
		return <ButtonVersionSlider options={SliderSettings}>{children}</ButtonVersionSlider>;
	} else return <DragVersionSlider>{children}</DragVersionSlider>;
}

function Item({ children, className, onClick }: { children: ReactElement; className?: string; onClick?: (...args: any[]) => void }) {
	return (
		<span onClick={onClick ? onClick : undefined} className={`slider__item__wrapper ${className ?? ''}`}>
			{children}
		</span>
	);
}

Slider.Item = Item;

export default Slider;
