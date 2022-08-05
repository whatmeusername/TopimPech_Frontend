import { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { CategoryData } from './interface';
import { default as CategoriesInitial } from './initialData.json';

class Categories {
	categories: CategoryData[];

	constructor(categories: CategoryData[]) {
		this.categories = categories;
	}

	get(): CategoryData[] {
		return this.categories;
	}

	find(start: string, end?: string): CategoryData | null {
		const SearchChild = (child: CategoryData): CategoryData | null => {
			let childrens = child.child;
			let childExists = childrens.find((child) => child.slug === end) ?? null;
			if (!childExists) {
				for (let child of childrens) {
					return SearchChild(child);
				}
			}
			return childExists;
		};
		const parentCategory = this.categories.find((category) => category.slug === start);
		if (parentCategory) {
			if (end) {
				return SearchChild(parentCategory);
			} else return parentCategory;
		}
		return null;
	}
}

const CategoryContextData = createContext<Categories>(null!);

export const CategoriesContext = ({ children }: { children: JSX.Element }) => {
	const [categories, setCategories] = useState<Categories>(new Categories(CategoriesInitial.categories));

	useEffect(() => {
		axios({
			method: 'GET',
			url: '/api/products/categories/',
		}).then((response) => {
			setCategories(new Categories(response.data));
		});
	}, []);

	return <CategoryContextData.Provider value={categories}>{children}</CategoryContextData.Provider>;
};

export default function useCategoriesContext(): Categories {
	return useContext(CategoryContextData);
}
