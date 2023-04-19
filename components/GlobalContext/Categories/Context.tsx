import { createContext, useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { CategoryData } from './interface';

class Categories {
	categories: CategoryData[];

	constructor(categories: CategoryData[]) {
		this.categories = categories;
	}

	get(): CategoryData[] {
		return this.categories;
	}

	find(start: string, end?: string): CategoryData | undefined {
		const SearchChild = (ancestor: CategoryData): CategoryData | undefined => {
			const childExists = ancestor.child.find((child) => child.slug === end);
			if (!childExists) {
				for (let i = 0; i < ancestor.child.length; i++) {
					return SearchChild(ancestor.child[i]);
				}
			}
			return childExists;
		};

		const parentCategory = this.categories.find((category) => category.slug === start);
		if (parentCategory) {
			return end ? SearchChild(parentCategory) : parentCategory;
		}
	}
}

const CategoryContextData = createContext<Categories>(null!);

const CategoriesContext = ({ children }: { children: JSX.Element }) => {
	const [categories, setCategories] = useState<Categories>(null!);

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
function useCategoriesContext(): Categories {
	return useContext(CategoryContextData);
}

export { CategoriesContext, useCategoriesContext, Categories };
