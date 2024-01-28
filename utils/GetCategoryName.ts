import { Capitalize } from './Capitalize';

const GetCategoryName = (data: {
	main: string | undefined;
	categoryStringAdditions?: { prefix: string; postfix: string };
	manufacturer?: string;
	capitalize?: boolean;
	isSearch?: boolean;
	replaceManufacturerInCategory?: boolean;
}): string => {
	if (data.isSearch) return data.main ?? '';
	else if (!data.main) return '';
	const prefix = data.categoryStringAdditions?.prefix;
	const postfix = data.categoryStringAdditions?.postfix;

	let resultString = data.main;
	if (data.manufacturer) {
		const includesInMain = resultString.includes(data.manufacturer);
		if (includesInMain && data?.replaceManufacturerInCategory) {
			resultString = resultString.replace(data.manufacturer, '');
			resultString += ` производителя ${data.manufacturer}`;
		} else if (!includesInMain) resultString += ` ${data.manufacturer}`;
	}

	resultString = `${prefix ? prefix + ' ' : ''}${resultString}${postfix ? ' ' + postfix : ''}`;

	return data.capitalize ? Capitalize(resultString) : resultString;
};

export { GetCategoryName };
