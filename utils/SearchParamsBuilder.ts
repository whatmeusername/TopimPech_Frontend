import { ReadonlyURLSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

function SearchParamsBuilder(
	url: string,
	searchParams: URLSearchParams | ParsedUrlQuery | undefined | ReadonlyURLSearchParams,
	rest: string[],
): [string, string] {
	const isURLSearchParams = searchParams === undefined || searchParams instanceof URLSearchParams || searchParams instanceof ReadonlyURLSearchParams;

	function getSearchParams(...params: string[]): string {
		let SearchParams = '?';
		params.forEach((param) => {
			const paramRes = isURLSearchParams ? (searchParams as URLSearchParams).get(param) : (searchParams as ParsedUrlQuery)[param];
			if (paramRes) {
				SearchParams += `${SearchParams.length === 1 ? '' : '&'}${param}=${encodeURIComponent(paramRes as string)}`;
			}
		});
		return SearchParams;
	}

	const SearchParams = getSearchParams(...rest);

	return [url + SearchParams, SearchParams];
}

export { SearchParamsBuilder };
