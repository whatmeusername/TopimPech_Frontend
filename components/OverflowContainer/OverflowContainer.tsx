import useToggle from '../../hooks/useToggle';
import { useRef, useEffect, useState } from 'react';

import './OverflowContainer.scss';

export default function OverflowContainer({
	children,
	maxHeight,
}: {
	children: JSX.Element;
	maxHeight: number;
}): JSX.Element {
	const [toggled, setToggled] = useToggle();
	const [overflow, setOverflow] = useState<boolean>();
	const content = useRef<HTMLDivElement>(null!);
	const overflowElement = useRef<HTMLDivElement>(null!);

	useEffect(() => {
		setOverflow(content.current.offsetHeight > maxHeight);
		//eslint-disable-next-line
	}, []);

	useEffect(() => {
		overflowElement.current.scrollTop = 0;
	}, [toggled]);

	return (
		<div className="oveflow__container__wrapper">
			<div
				className={`oveflow__container__hidder ${toggled ? 'oveflow__container__content__active' : ''}`}
				ref={overflowElement}
				style={{ maxHeight: toggled ? maxHeight + 25 : maxHeight }}
			>
				<div className="oveflow__container__content" ref={content}>
					{children}
				</div>
			</div>
			{overflow ? (
				<button className="oveflow__container__toggle__button" onClick={() => setToggled()}>
					{!toggled ? 'Показать все' : 'Скрыть'}
				</button>
			) : (
				''
			)}
		</div>
	);
}
