import './breadcrumb.scss';

import { Fragment as ReactFragment } from 'react';
import { CategoryDataOmit } from '../../../context/Breadcrumb/interface';
import Link from 'next/link';

import { useBreadcrumbContext } from '../../../context/Breadcrumb';
import { useParams } from 'next/navigation';

interface BreadcrumbSettings {
	includeHomePage?: boolean;

	category?: string;
	includeAtEnd?: {
		label: string;
		slug: string;
	};
}

export default function BreadcrumbByURL({ settings }: { settings?: BreadcrumbSettings }): JSX.Element {
	const breacrumbData = useBreadcrumbContext();
	let { category } = useParams();

	if (!breacrumbData) return <></>;

	let currentBreadcrumbItem = breacrumbData.getEndWith(settings?.category ?? category);
	if (!currentBreadcrumbItem) return <></>;

	if (settings?.includeHomePage) {
		currentBreadcrumbItem.start = 'glavnay';
		currentBreadcrumbItem.contains.unshift('glavnay');
		currentBreadcrumbItem.data.unshift({ name: 'главная', slug: 'glavnay', href: '/' });
	}

	if (settings?.includeAtEnd) {
		currentBreadcrumbItem.data.push({
			name: settings.includeAtEnd.label,
			slug: settings.includeAtEnd.slug,
			href: '',
		});
	}

	const BreadcrumbItem = ({ data }: { data: CategoryDataOmit }) => {
		const url = data?.href ?? `/catalog/${data.slug}`;
		return (
			<Link href={url} className="breadcrumb__item breadcrumb__item__link">
				{data.name}
			</Link>
		);
	};

	const BreadcrumbLength = currentBreadcrumbItem.data.length - 1;

	return (
		<div className="breadcrumb__wrapper">
			{currentBreadcrumbItem.data.map((breadcrumbItem, index) => {
				if (BreadcrumbLength !== index) {
					return (
						<ReactFragment key={`breadcrumb__item-${breadcrumbItem.slug}`}>
							<BreadcrumbItem data={breadcrumbItem} />
							<span className="breadcrumb__slash">/</span>
						</ReactFragment>
					);
				} else {
					return (
						<div className="breadcrumb__item breadcrumb__item__active" key={`breadcrumb__item-${breadcrumbItem.slug}`}>
							<span>{breadcrumbItem.name}</span>
						</div>
					);
				}
			})}
		</div>
	);
}
