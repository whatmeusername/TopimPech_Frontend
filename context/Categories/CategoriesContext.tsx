'use client';

import { createContext, useEffect, useState, useContext, ReactElement } from 'react';
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

	findByAncestor(start: string, end?: string): CategoryData | undefined {
		const SearchChild = (ancestor: CategoryData): CategoryData | undefined => {
			const stack = [ancestor];
			while (stack.length > 0) {
				const node = stack.pop() as CategoryData;
				const childExists = node.child.find((child) => child.slug === end);
				if (!childExists) {
					stack.push(...ancestor.child);
				}
				return childExists;
			}
		};

		const parentCategory = this.categories.find((category) => category.slug === start);
		return end && parentCategory ? SearchChild(parentCategory) : parentCategory;
	}

	find(item: string): CategoryData | undefined {
		const SearchChild = (ancestor: CategoryData): CategoryData | undefined => {
			const stack = [ancestor];
			while (stack.length > 0) {
				const node = stack.pop() as CategoryData;
				const childExists = node.child.find((child) => child.slug === item);
				if (!childExists) {
					stack.push(...node.child);
				} else return childExists;
			}
		};

		for (let i = 0; i < this.categories.length; i++) {
			if (this.categories[i].slug === item) return this.categories[i];

			const result = SearchChild(this.categories[i]);
			if (result) return result;
		}
	}
}

const CategoryContextData = createContext<Categories>(null!);

const CategoriesContext = ({ children, initialCategories }: { children: ReactElement; initialCategories?: CategoryData[] }) => {
	const [categories, setCategories] = useState<Categories>(initialCategories ? new Categories(initialCategories) : null!);

	useEffect(() => {
		if (!initialCategories) {
			axios({
				method: 'GET',
				url: '/api/products/categories/',
			}).then((response) => {
				setCategories(new Categories(response.data.categories));
			});
		}
	}, []);

	return <CategoryContextData.Provider value={categories}>{children}</CategoryContextData.Provider>;
};
function useCategoriesContext(): Categories {
	return useContext(CategoryContextData);
}

export { CategoriesContext, useCategoriesContext, Categories };
