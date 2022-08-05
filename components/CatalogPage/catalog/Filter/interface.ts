interface FilterItem{
	valueType: 'number' | 'string'
	name: string
	values: {[K: string]: {items: number, name: string}}
}
interface FilterData{[K: string]: FilterItem}

export type {FilterItem, FilterData}