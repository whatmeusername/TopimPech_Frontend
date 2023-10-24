import { Capitalize } from './Capitalize';

const GetCategoryNameWithAdditional = (
	categoryName: string | undefined,
	categoryStringAdditions: { prefix: string; postfix: string },
	capotalize?: boolean,
): string => {
	const prefix = categoryStringAdditions.prefix;
	const postfix = categoryStringAdditions.postfix;

	const string = `${prefix ? prefix + ' ' : ''}${categoryName}${postfix ? ' ' + postfix : ''}`;

	return capotalize ? Capitalize(string) : string;
};

export { GetCategoryNameWithAdditional };
