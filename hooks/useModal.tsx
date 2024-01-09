import { useState, useEffect } from 'react';

export default function useModal(modalElement: React.MutableRefObject<HTMLElement>): [boolean, (value: boolean) => void] {
	const [modalActive, setModalActive] = useState<boolean>(false);

	useEffect(() => {
		function listenClick(event: React.MouseEvent | MouseEvent) {
			const target = event.target as HTMLElement;
			if (modalElement.current && !modalElement.current.contains(target)) {
				setModalActive(false);
			}
		}
		if (modalActive) {
			window.addEventListener('mousedown', listenClick);
			return () => window.removeEventListener('mousedown', listenClick);
		}
		//eslint-disable-next-line
	}, [modalActive]);

	return [modalActive, setModalActive];
}
