import { ReadonlyURLSearchParams } from 'next/navigation';
import { ParsedUrlQuery } from 'querystring';

function SearchParamsBuilder(
	url: string,
	query: URLSearchParams | ParsedUrlQuery | undefined | ReadonlyURLSearchParams,
	...rest: string[]
): [string, string] {
	const isURLSearchParams = query === undefined || query instanceof URLSearchParams || query instanceof ReadonlyURLSearchParams;
	const searchParams: URLSearchParams | ParsedUrlQuery = isURLSearchParams ? new URLSearchParams(window.location.search) : query;

	function getSearchParams(...params: string[]): string {
		let SearchParams = '?';
		params.forEach((param) => {
			const paramRes = isURLSearchParams ? (searchParams as URLSearchParams).get(param) : (searchParams as ParsedUrlQuery)[param];
			if (paramRes) {
				SearchParams += `${SearchParams.length === 1 ? '' : '&'}${param}=${paramRes}`;
			}
		});
		return SearchParams;
	}

	const SearchParams = getSearchParams(...rest);

	return [url + SearchParams, SearchParams];
}

export { SearchParamsBuilder };
