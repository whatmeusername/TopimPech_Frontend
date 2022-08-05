import { createContext, useState, useEffect, useContext } from 'react';
import type { CategoryData, CategoryDataOmit, BreadcrumbData } from './interface';
import useCategoriesContext from '../Categories/Context';

const BreadcrumbContextData = createContext<Breadcrumb>(null!);

export class Breadcrumb {
	BreadcrumbData: BreadcrumbData[];
	constructor(BreadcrumbData: BreadcrumbData[]) {
		this.BreadcrumbData = BreadcrumbData;
	}

	get(getData: { start?: string; end?: string }) {
		const { start, end } = getData;
		if (start && !end) {
			return this.BreadcrumbData.find((breacrumb) => {
				return breacrumb.start === start;
			});
		} else if (!start && end) {
			return this.BreadcrumbData.find((breacrumb) => {
				return breacrumb.end === end || breacrumb.contains.includes(end);
			});
		} else if (start && end) {
			return this.BreadcrumbData.find((breacrumb) => {
				return breacrumb.start === start && (breacrumb.end === end || breacrumb.contains.includes(end));
			});
		}
	}

	getUntil(BreadcrumbData: BreadcrumbData, start: string, end: string): BreadcrumbData {
		BreadcrumbData = JSON.parse(JSON.stringify(BreadcrumbData));
		let breacrumbContains = BreadcrumbData.contains;
		let startIndex = breacrumbContains.findIndex((breacrumb) => breacrumb === start);
		let endIndex = breacrumbContains.findIndex((breacrumb) => breacrumb === end);
		if (startIndex > -1 && endIndex > -1) {
			BreadcrumbData.start = start;
			BreadcrumbData.end = end;
			BreadcrumbData.contains = BreadcrumbData.contains.slice(startIndex, endIndex + 1);
			BreadcrumbData.data = BreadcrumbData.data.slice(startIndex, endIndex + 1);
		}
		return BreadcrumbData;
	}
}
const BuildBreadcrumbData = (categories: CategoryData[]) => {
	let BreadcrumbData = [];

	let parentCategory: CategoryData;
	let start: string;
	let end: string;
	let contains: string[];
	let data: CategoryDataOmit[];

	const BuildPath = (category: CategoryData) => {
		let categpryWithoutChild = { name: category.name, slug: category.slug };

		if (category.child.length > 0) {
			contains.push(categpryWithoutChild.slug);
			data.push(categpryWithoutChild);

			category.child.forEach((child) => {
				BuildPath(child);
			});

			contains = contains.slice(0, contains.length - 1);
			data = data.slice(0, data.length - 1);
		} else {
			contains.push(categpryWithoutChild.slug);
			data.push(categpryWithoutChild);
			end = categpryWithoutChild.slug;

			BreadcrumbData.push({
				start: start,
				end: end,
				contains: contains,
				data: data,
			});

			contains = contains.slice(0, contains.length - 1);
			data = data.slice(0, data.length - 1);
			return;
		}
	};

	for (let i = 0; i < categories?.length; i++) {
		parentCategory = categories[i];
		let parentWithoutChild = { name: parentCategory.name, slug: parentCategory.slug };
		start = parentCategory.slug;
		contains = [start];

		data = [parentWithoutChild];

		if (parentCategory.child.length > 0) {
			for (let i = 0; i < parentCategory.child.length; i++) {
				BuildPath(parentCategory.child[i]);
				data = [parentWithoutChild];
				contains = [start];
			}
		} else {
			BreadcrumbData.push({
				start: start,
				end: '',
				contains: contains,
				data: data,
			});
		}
	}
	return BreadcrumbData;
};

function BreadcrumbContext({ children }: { children: JSX.Element }): JSX.Element {
	const categories = useCategoriesContext();
	const [breadcrumbData, setBreadcrumbData] = useState<Breadcrumb>(
		new Breadcrumb(BuildBreadcrumbData(categories.get())),
	);

	return <BreadcrumbContextData.Provider value={breadcrumbData}>{children}</BreadcrumbContextData.Provider>;
}

export { BreadcrumbContext };
export default function useBreadcrumbContext(): Breadcrumb {
	return useContext(BreadcrumbContextData);
}
