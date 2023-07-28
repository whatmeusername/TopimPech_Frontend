import { Fragment, ReactElement } from 'react';
import './JsonDataMap.scss';

interface JsonDataMap {
	header?: string;
	subHeader?: string;
	text?: string | string[];
	list?: string[];
}

function JsonDataMap({ data }: { data: JsonDataMap[] }): ReactElement {
	const Header = ({ data }: { data: JsonDataMap }): ReactElement | null => {
		if (data.header) {
			return <h2>{data.header}</h2>;
		} else if (data.subHeader) {
			return <h3>{data.subHeader}</h3>;
		} else return null;
	};

	const List = ({ data }: { data: JsonDataMap }): ReactElement | null => {
		if (data.list && data.list.length > 0) {
			return (
				<ul>
					{data.list.map((item: string, i: number) => {
						return <li key={`json__data__list__item${i}`}>{item}</li>;
					})}
				</ul>
			);
		}
		return null;
	};

	const Text = ({ data }: { data: JsonDataMap }): ReactElement | null => {
		if (data.text) {
			if (Array.isArray(data.text)) {
				return (
					<Fragment>
						{data.text.map((text, i) => {
							return <p key={`json__data__text__item${i}`}>{text}</p>;
						})}
					</Fragment>
				);
			} else {
				return <p>{data.text}</p>;
			}
		}
		return null;
	};

	return (
		<div className="json__data__content__wrapper">
			{data.map((block: any, i: number) => {
				return (
					<Fragment key={`delivery__page__element__${i}`}>
						<Header data={block} />
						<List data={block} />
						<Text data={block} />
					</Fragment>
				);
			})}
		</div>
	);
}

export { JsonDataMap };
