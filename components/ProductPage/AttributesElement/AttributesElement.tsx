import { ReactElement } from 'react';
import { Property } from '../../CatalogComponents/Cards/interface';
import { SmoothScrollToAnchor } from '../../../utils';

import './AttributeElement.scss';

const AttributeElement = ({ item }: { item: Property }): ReactElement => {
	return (
		<dl key={`product__properties__${item.key.slug}`} className="product__page__properties__item">
			<dt className="product__page__properties__item__key">{item.key.name}</dt>
			<dd className="product__page__properties__item__value">
				{item.value} {item.key.valueUnit}
			</dd>
		</dl>
	);
};

const AttributesElement = ({ properties }: { properties: Property[] }): ReactElement => {
	return (
		<div className=" product__page__card product__page__properties" id="product__page__properties">
			<h3 className="product__page__header__medium product__page__properties__header">Характеристика</h3>
			<div className="product__page__properties__content">
				{properties.map((prop) => {
					if (!prop.key) return null;
					return <AttributeElement item={prop} key={`product__properties__${prop.key.slug}`} />;
				})}
			</div>
		</div>
	);
};

function ShortAttributesElement({ properties, take }: { properties: Property[]; take: number }): ReactElement {
	return (
		<div className="product__page__properties__short">
			<h5 className="product__page__properties__short__header">Характеристики:</h5>
			<div className="product__page__properties__short__content">
				{properties.slice(0, take).map((prop) => {
					if (!prop.key) return null;
					return <AttributeElement item={prop} key={`product__properties__${prop.key.slug}`} />;
				})}
			</div>
			{properties.length > take ? (
				<button
					className="product__page__properties__short__show__all"
					onClick={() => {
						SmoothScrollToAnchor('#product__page__properties', 500);
					}}
				>
					Показать все характеристики
				</button>
			) : null}
		</div>
	);
}

export { AttributesElement, ShortAttributesElement };