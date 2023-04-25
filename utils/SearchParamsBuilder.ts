export function SearchParamsBuilder(url: string, query: ParsedUrlQuery | undefined, ...rest: string[]): [string, string] {
	const isURLSearchParams = query === undefined;
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
