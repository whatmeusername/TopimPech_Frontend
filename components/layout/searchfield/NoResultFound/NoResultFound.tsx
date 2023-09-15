import { ReactElement } from 'react';
import { SearchIcon } from '../../../IconsElements';
import './NoResultFound.scss';

const NoResultFound = ({ searchString }: { searchString: string | undefined }): ReactElement | null => {
	if (!searchString || searchString === '') return null;
	return (
		<div className="search__input__no__result__wrapper">
			<SearchIcon className="search__input__no__result__icon" />
			<div className="search__input__no__result__content">
				<p className="search__input__no__result__text">По вашему запросу</p>
				<p className="search__input__no__result__search__text">&laquo;{searchString}&raquo;</p>
				<p className="search__input__no__result__text">Не было найдено результатов</p>
			</div>
		</div>
	);
};

export { NoResultFound };
