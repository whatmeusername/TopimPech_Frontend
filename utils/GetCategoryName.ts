import { Capitalize } from './Capitalize';

const GetCategoryName = (data: {
	main?: string | undefined;
	categoryStringAdditions?: { prefix: string; postfix: string };
	manufacturer?: string;
	capitalize?: boolean;
	isSearch?: boolean;
}): string => {
	if (data.isSearch) {
		return data.main ?? '';
	}
	if (!data.main) return '';
	const prefix = data.categoryStringAdditions?.prefix;
	const postfix = data.categoryStringAdditions?.postfix;

	let resultString = data.main;
	if (data.manufacturer && !resultString.includes(data.manufacturer)) {
		resultString += ` ${data.manufacturer}`;
	}

	resultString = `${prefix ? prefix + ' ' : ''}${resultString}${postfix ? ' ' + postfix : ''}`;

	return data.capitalize ? Capitalize(resultString) : resultString;
};

export { GetCategoryName };
