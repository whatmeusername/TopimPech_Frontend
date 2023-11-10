import './breadcrumb.scss';

import { ReactElement, Fragment as ReactFragment } from 'react';
import { CategoryDataOmit } from '../../../context/Breadcrumb/interface';
import Link from 'next/link';

import { useBreadcrumbContext } from '../../../context/Breadcrumb';

import { Capitalize } from '../../../utils/Capitalize';

interface BreadcrumbSettings {
	includeHomePage?: boolean;

	includeAtEnd?: {
		label: string;
		slug: string;
		href: string;
	};
}

export default function BreadcrumbByURL({ category, settings }: { category: string; settings?: BreadcrumbSettings }): ReactElement | null {
	const breacrumbData = useBreadcrumbContext();

	const currentBreadcrumbItem = breacrumbData?.getEndWith(category);
	if (!currentBreadcrumbItem) return null;

	if (settings?.includeHomePage) {
		currentBreadcrumbItem.start = 'glavnay';
		currentBreadcrumbItem.contains.unshift('glavnay');
		currentBreadcrumbItem.data.unshift({ name: 'главная', slug: 'glavnay', href: '/', productCount: 0 });
	}

	if (settings?.includeAtEnd) {
		currentBreadcrumbItem.data.push({
			name: settings.includeAtEnd.label,
			slug: settings.includeAtEnd.slug,
			href: settings.includeAtEnd.href ?? '/',
			productCount: 0,
		});
	}

	const BreadcrumbItem = ({ data, position }: { data: CategoryDataOmit; position: number }) => {
		const url = data?.href ?? `/catalog/${data.slug}`;
		return (
			<li
				className="breadcrumb__item__wrapper breadcrumb__item__link__wrapper"
				itemProp="itemListElement"
				itemScope
				itemType="https://schema.org/ListItem"
			>
				<Link href={url} className="breadcrumb__item breadcrumb__item__link" itemProp="item">
					<span itemProp="name" className="breadcrumb__item__text">
						{Capitalize(data.name)}
					</span>
				</Link>
				<meta itemProp="position" content={position.toString()} />
			</li>
		);
	};

	const BreadcrumbLength = currentBreadcrumbItem.data.length - 1;

	return (
		<ul className="breadcrumb__content" itemScope itemType="http://schema.org/BreadcrumbList">
			{currentBreadcrumbItem.data.map((breadcrumbItem, index) => {
				if (BreadcrumbLength !== index) {
					return (
						<ReactFragment key={`breadcrumb__item-${breadcrumbItem.slug}`}>
							<BreadcrumbItem data={breadcrumbItem} position={index + 1} />
							<span className="breadcrumb__slash">/</span>
						</ReactFragment>
					);
				} else {
					const url = breadcrumbItem?.href ?? `/catalog/${breadcrumbItem.slug}`;
					return (
						<div
							className="breadcrumb__item breadcrumb__item__active"
							key={`breadcrumb__item-${breadcrumbItem.slug}`}
							itemProp="itemListElement"
							itemScope
							itemType="https://schema.org/ListItem"
						>
							<span itemProp="name" className="breadcrumb__item__text">
								{Capitalize(breadcrumbItem.name)}
							</span>
							<meta itemProp="position" content={(BreadcrumbLength + 1).toString()} />
							<meta itemProp="item" content={url} />
						</div>
					);
				}
			})}
		</ul>
	);
}
