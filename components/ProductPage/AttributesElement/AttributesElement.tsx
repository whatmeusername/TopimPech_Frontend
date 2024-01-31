import { ReactElement } from 'react';
import { ProductData, Property } from '../../CatalogComponents/Cards/interface';
import { SmoothScrollToAnchor } from '../../../utils';

import './AttributeElement.scss';
import { Capitalize } from '../../../utils/Capitalize';
import { GroupAttributes } from '../../../utils/GroupAttributes';
import { TipPopUpElementPropertyContent } from '../../Shared/TipPopUpElementPropertyContent/TipPopUpElementPropertyContent';

const AttributeElement = ({ item, showTipPop }: { item: Property; showTipPop: boolean }): ReactElement => {
	return (
		<dl key={`product__properties__${item.key.slug}`} className="product__page__properties__item">
			{showTipPop && item.key.description ? <TipPopUpElementPropertyContent header={item.key.name} description={item.key.description} /> : null}
			<dt className="product__page__properties__item__key">
				<p className="product__page__properties__item__key__value">{item.key.name}</p>
			</dt>
			<dd className="product__page__properties__item__value__wrapper">
				<span className="product__page__properties__item__value">
					{item.value} {item.key.valueUnit}
				</span>
			</dd>
		</dl>
	);
};

function AttributesElement({ product }: { product: ProductData }): ReactElement | null {
	if (product.properties.length === 0) return null;
	const properties = product.properties;
	const groupedAttributes = GroupAttributes(properties);
	return (
		<div className=" product__page__card product__page__properties" id="product__page__properties">
			<h3 className="product__page__header__medium product__page__properties__header">Характеристика</h3>
			<div className="product__page__properties__content">
				{Object.entries(groupedAttributes).map(([key, attributes]) => {
					return (
						<div className="product__page__properties__block__wrapper" key={`product__page__properties__item__wrapper__${key}`}>
							<h3 className="product__page__properties__block__header">{Capitalize(key)}</h3>

							{attributes.map((prop) => {
								if (!prop.key) return null;
								return <AttributeElement item={prop} key={`product__properties__${prop.key.slug}`} showTipPop={true} />;
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function ShortAttributesElement({ product, take, showAllBtn }: { product: ProductData; take: number; showAllBtn: boolean }): ReactElement | null {
	if (product.properties && product.properties.length === 0) return null;

	const properties = product.properties;

	return (
		<div className="product__page__properties__short">
			<h5 className="product__page__properties__short__header">Характеристика:</h5>
			<div className="product__page__properties__short__content">
				{properties.slice(0, take).map((prop) => {
					if (!prop.key) return null;
					return <AttributeElement item={prop} key={`product__properties__${prop.key.slug}`} showTipPop={false} />;
				})}
			</div>
			{showAllBtn && properties.length > take ? (
				<button
					className="product__page__properties__short__show__all"
					onClick={() => {
						SmoothScrollToAnchor('#product__page__properties', 500);
					}}
				>
					Перейти ко всем параметрам
				</button>
			) : null}
		</div>
	);
}

export { AttributesElement, ShortAttributesElement };
