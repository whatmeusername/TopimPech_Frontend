function getItemsPerPage(): number {
	let itemsPerPage = 36;
	if (typeof window !== 'undefined') {
		const searchParams = new URLSearchParams(window.location.search);
		const itemsPerPageParsed = searchParams.get('items_per_page');
		itemsPerPage = itemsPerPageParsed !== null && typeof itemsPerPageParsed === 'string' ? Number(itemsPerPageParsed) : itemsPerPage;
	}
	return itemsPerPage;
}

export { getItemsPerPage };
