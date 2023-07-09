import { useRef, useState, useEffect, ReactElement } from 'react';
import './Slider.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useMobile } from '../../../context/MobileContext/MobileContext';

const ACTIVE_DOT_CLASSNAME = 'slider__dot__active';
const DISABLED_BUTTON_CLASSNAME = 'slider__button__disabled';

interface SliderSettings {
	ItemsPerSlide?: number | 'auto';
	mobileSize?: number;
	enableSlideButtons?: boolean;
}

enum SlideDirection {
	LEFT = 'left',
	RIGHT = 'right',
}

function ButtonVersionSlider({ children, options }: { children: JSX.Element; options?: SliderSettings }) {
	const [current, setCurrent] = useState<number>(0);

	const IS_BUTTON_ACTIVE = useRef<boolean>(options?.enableSlideButtons ?? true);

	const dotsRef = useRef<HTMLDivElement>(null!);
	const wrapperRef = useRef<HTMLDivElement>(null!);
	const contentRef = useRef<HTMLDivElement>(null!);

	const [LBDisabled, setLBDisabled] = useState<boolean>(false);
	const [RBDisabled, setRBDisabled] = useState<boolean>(false);

	const currentSlide = useRef<number>(0);
	const slidesTotal = useRef<number>(0);

	const [itemsCount, setItemsCount] = useState<number>(-1);
	const itemsPerSlide = useRef<number>(options?.ItemsPerSlide === 'auto' ? null! : options?.ItemsPerSlide ?? null!);
	const itemWidth = useRef<number>(0);

	const DOTS_COUNT = Math.ceil(itemsCount / (itemsPerSlide.current ?? 1)) + 1;
	const dots = Array.from(Array(DOTS_COUNT).keys());

	useEffect(() => {
		const wrapperInnerWidth = contentRef.current.offsetWidth;
		const contentItems = contentRef.current.childNodes;

		if (contentRef.current.childNodes.length === 0) return;

		itemWidth.current = (contentItems[0] as HTMLElement).offsetWidth;

		itemsPerSlide.current = itemsPerSlide.current === null ? Math.floor(wrapperInnerWidth / itemWidth.current) : itemsPerSlide.current;
		const itemsCount = contentItems.length - itemsPerSlide.current;

		slidesTotal.current = Math.ceil(itemsCount / itemsPerSlide.current);
		contentRef.current.style.width = `${itemsPerSlide.current * itemWidth.current}px`;

		IS_BUTTON_ACTIVE.current = itemsCount > 0 ? true : false;

		setItemsCount(itemsCount);
		validateButtons();
	}, []);

	useEffect(() => {
		contentRef.current.style.left = `-${itemWidth.current * current}px`;
	}, [current]);

	const SlideItem = (side: SlideDirection, to: number): void => {
		const itemsToSlide = to !== null ? to : 1;
		if (side === SlideDirection.RIGHT) {
			setCurrent(itemsCount >= current + itemsToSlide ? current + itemsToSlide : itemsCount);
			setActiveDot(currentSlide.current + 1 <= slidesTotal.current ? currentSlide.current + 1 : slidesTotal.current);
		} else if (side === SlideDirection.LEFT) {
			setCurrent(current - itemsToSlide >= 0 ? current - itemsToSlide : 0);
			setActiveDot(current - itemsToSlide >= 0 ? currentSlide.current - 1 : 0);
		}
	};

	const SlideTo = (to: number): void => {
		if (current !== to) {
			if (to < 0) to = 0;
			else if (to > itemsCount) to = itemsCount;

			setCurrent(to);
			findDotAndSetActive(to);
		}
	};

	const validateButtons = () => {
		if (IS_BUTTON_ACTIVE.current) {
			setLBDisabled(currentSlide.current === 0);
			setRBDisabled(currentSlide.current === slidesTotal.current);
		}
	};

	const findDotAndSetActive = (to: number) => {
		const dots = dotsRef.current.childNodes as NodeListOf<HTMLElement>;
		for (let i = 0; i < dots.length; i++) {
			const dot = dots[i];
			const slidesNumber = Number(dot.dataset.slides);
			if (to <= slidesNumber) {
				dots[currentSlide.current]?.classList.remove(ACTIVE_DOT_CLASSNAME);
				dots[i]?.classList.add(ACTIVE_DOT_CLASSNAME);
				currentSlide.current = i;

				validateButtons();
				break;
			}
		}
	};

	const setActiveDot = (nextSlide: number) => {
		const dots = dotsRef.current.childNodes as NodeListOf<HTMLElement>;

		dots[currentSlide.current]?.classList.remove(ACTIVE_DOT_CLASSNAME);
		dots[nextSlide]?.classList.add(ACTIVE_DOT_CLASSNAME);
		currentSlide.current = nextSlide;

		validateButtons();
	};

	const SliderButton = ({ side }: { side: SlideDirection }): ReactElement => {
		const icon = side === SlideDirection.LEFT ? faAngleLeft : faAngleRight;
		const isDisabledSide = side === SlideDirection.LEFT ? LBDisabled : RBDisabled;

		return (
			<button
				className={`${isDisabledSide ? DISABLED_BUTTON_CLASSNAME : ''} slider__content__slide__button`}
				onClick={isDisabledSide ? undefined : () => SlideItem(side, itemsPerSlide.current)}
				title={`переключиться на ${side === SlideDirection.LEFT ? 'левый' : 'правый'} слайд`}
			>
				<FontAwesomeIcon icon={icon} className="slider__content__slide__icon" />
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
			<div className={`slider__main__content ${slidesTotal.current === 0 ? 'slider__main__content__single' : ''}`}>
				{IS_BUTTON_ACTIVE.current ? <SliderButton side={SlideDirection.LEFT} /> : null}
				<div className="slider__content__wrapper">
					<div className="slider__content" ref={contentRef}>
						{children}
					</div>
					{IS_BUTTON_ACTIVE.current ? <DotsElement /> : null}
				</div>
				{IS_BUTTON_ACTIVE.current ? <SliderButton side={SlideDirection.RIGHT} /> : null}
			</div>
		</div>
	);
}

function DragVersionSlider({ children }: { children: JSX.Element }) {
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
				<div className="slider__content__wrapper" ref={contentWrapperRef} onMouseDown={DragStart}>
					<div className="slider__content" ref={contentRef}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

function Slider({ children, SliderSettings }: { children: JSX.Element | ReactElement; SliderSettings?: SliderSettings }) {
	const isMobile = useMobile(SliderSettings?.mobileSize ?? 720);
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
