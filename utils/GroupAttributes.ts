import { Property } from '../components/CatalogComponents/Cards/interface';

function GroupAttributes(properties: Property[]): { [K: string]: Property[] } {
	const result: { [K: string]: Property[] } = {};
	for (let i = 0; i < properties.length; i++) {
		if (result[properties[i].key.keyGroup]) {
			result[properties[i].key.keyGroup].push(properties[i]);
		} else {
			result[properties[i].key.keyGroup] = [properties[i]];
		}
	}
	return result;
}

export { GroupAttributes };
