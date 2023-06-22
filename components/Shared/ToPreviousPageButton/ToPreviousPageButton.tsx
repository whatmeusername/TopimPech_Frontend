import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import './ToPreviousPageButton.scss';
import { ArrowIcon } from '../../IconsElements';

const ToPreviousPageButton = (): ReactElement => {
	const router = useRouter();

	return (
		<button
			className="previous__page__btn"
			onClick={() => {
				router.back();
			}}
		>
			<ArrowIcon className="previous__page__icon" />
			<span className="previous__page__label">вернуться на предыдущию страницу</span>
		</button>
	);
};

export { ToPreviousPageButton };
