import './breadcrumb.scss';

import { Fragment as ReactFragment } from 'react';
import { useBreadcrumbContext } from '../../GlobalContext/';
import { CategoryDataOmit } from '../../GlobalContext/Breadcrumb/interface';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbSettings {
	includeHomePage?: boolean;

	categoryData?: {
		maincategory: string;
		category: string;
	};
	includeAtEnd?: {
		label: string;
		slug: string;
	};
}

export default function BreadcrumbByURL({ settings }: { settings?: BreadcrumbSettings }): JSX.Element {
	const breacrumbData = useBreadcrumbContext();
	const router = useRouter();

	let maincategory: string, category: string;

	if (!settings?.categoryData) {
		maincategory = router.query?.maincategory as string;
		category = router.query?.category as string;
	} else {
		maincategory = settings.categoryData?.maincategory as string;
		category = settings.categoryData?.category as string;
	}
	if (!breacrumbData) return <></>;

	let currentBreadcrumbItem = breacrumbData.get({ start: maincategory, end: category });
	if (!currentBreadcrumbItem) return <></>;

	console.log(breacrumbData);

	currentBreadcrumbItem = breacrumbData.getUntil(
		currentBreadcrumbItem,
		maincategory ?? '',
		category ? category : maincategory ?? '',
	);

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
		const url =
			data?.href ??
			`/catalog/${maincategory !== data.slug ? maincategory + '/' + data.slug + '/' : maincategory + '/'}`;
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
