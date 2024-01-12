import { ReactElement, useEffect, useRef, useState } from 'react';
import useModal from '../../../hooks/useModal';
import { QuestionIcon } from '../../IconsElements';
import './TipPopUpElement.scss';

function TipPopUpElement({
	children,
	stopPropagation,
	parent,
}: {
	children?: ReactElement | null;
	stopPropagation: boolean;
	parent?: HTMLElement;
}): ReactElement {
	const popUpRef = useRef<HTMLDivElement>(null!);
	const popUpContentRef = useRef<HTMLDivElement>(null!);
	const [popUpActive, setPopUpActive] = useModal(popUpRef);
	const [popUpXDirection, setPopUpXDirection] = useState<'left' | 'right' | 'center' | null>(null);
	const [popUpYDirection, setPopUpYDirection] = useState<'up' | 'down' | null>(null);
	const [isLoaded, setIsLoaded] = useState<boolean>(false);

	const updatePopUpPosition = () => {
		const contentRect = popUpContentRef.current.getBoundingClientRect();
		let parentHasSpaceUp, parentHasSpaceDown, parentHasSpaceLeft, parentHasSpaceRight;
		if (parent) {
			const parentRect = parent.getBoundingClientRect();
			parentHasSpaceUp = contentRect.top >= parentRect.top;
			parentHasSpaceDown = parentRect.height + parent.scrollTop >= contentRect.bottom;
			parentHasSpaceRight = parent.offsetWidth + parentRect.left - contentRect.right >= 0;
			parentHasSpaceLeft = parent.offsetWidth + parentRect.left - contentRect.left >= contentRect.width;
		} else {
			parentHasSpaceUp = contentRect.top >= window.innerHeight + window.screenTop;
			parentHasSpaceDown = contentRect.bottom >= window.innerHeight + window.screenTop;
			parentHasSpaceRight = window.innerWidth - contentRect.right >= 0;
			parentHasSpaceLeft = window.innerWidth - contentRect.left >= 0;
		}

		if (!parentHasSpaceRight && parentHasSpaceLeft) {
			setPopUpXDirection('left');
		} else if (!parentHasSpaceRight && !parentHasSpaceLeft) {
			setPopUpXDirection('center');
		} else {
			setPopUpXDirection('right');
		}

		if (parentHasSpaceUp && !parentHasSpaceDown) {
			setPopUpYDirection('up');
		} else if (!parentHasSpaceUp && parentHasSpaceDown) {
			setPopUpYDirection('down');
		} else {
			setPopUpYDirection(null);
		}
	};

	useEffect(() => {
		if (isLoaded) return;
		updatePopUpPosition();
		if (popUpActive) setIsLoaded(true);
	}, [popUpActive]);

	return (
		<div
			className={`tip__pop__up__wrapper ${popUpActive ? 'tip__pop__up__active' : 'tip__pop__up__inactive'} tip__pop__up__wrapper__${
				popUpXDirection ?? 'unset'
			} `}
			ref={popUpRef}
		>
			<button
				className="tip__pop__up__button"
				onClick={(e) => {
					if (stopPropagation) e.stopPropagation();
					setPopUpActive(!popUpActive);
				}}
			>
				<QuestionIcon className="tip__pop__up__button__icon" />
			</button>
			<div
				className={`tip__pop__up__content__modal tip__pop__up__content__side__${popUpYDirection ?? 'unset'} ${
					isLoaded ? 'tip__pop__up__wrapper__loaded' : ''
				}`}
				ref={popUpContentRef}
			>
				<div className="tip__pop__up__content">{children}</div>
			</div>
		</div>
	);
}

export { TipPopUpElement };
