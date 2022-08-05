import styles from './breadcrumb.module.scss';

import { Fragment as ReactFragment } from 'react';
import useBreadcrumbContext from '../../GlobalContext/Breadcrumb/Context';
import { CategoryDataOmit } from '../../GlobalContext/Breadcrumb/interface';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BreadcrumbSettings {
	includeHomePage?: boolean;
}

export default function BreadcrumbByURL({ settings }: { settings?: BreadcrumbSettings }): JSX.Element {
	const breacrumbData = useBreadcrumbContext();
	const router = useRouter();
	const { maincategory, category } = router.query as { maincategory: string; category: string };
	if (!breacrumbData) return <></>;

	let currentBreadcrumbItem = breacrumbData.get({ start: maincategory, end: category });
	if (!currentBreadcrumbItem) return <></>;

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

	const BreadcrumbItem = ({ data }: { data: CategoryDataOmit }) => {
		const url =
			data?.href ??
			`/catalog/${maincategory !== data.slug ? maincategory + '/' + data.slug + '/' : maincategory + '/'}`;
		return (
			<Link href={url}>
				<a className={styles.breadcrumb__item + ' ' + styles.breadcrumb__item__link}>{data.name}</a>
			</Link>
		);
	};

	const BreadcrumbLength = currentBreadcrumbItem.data.length - 1;

	return (
		<div className={styles.breadcrumb__wrapper}>
			{currentBreadcrumbItem.data.map((breadcrumbItem, index) => {
				if (BreadcrumbLength !== index) {
					return (
						<ReactFragment key={`breadcrumb__item-${breadcrumbItem.slug}`}>
							<BreadcrumbItem data={breadcrumbItem} />
							<span className={styles.breadcrumb__slash}>/</span>
						</ReactFragment>
					);
				} else {
					return (
						<div
							className={styles.breadcrumb__item + ' ' + styles.breadcrumb__item__active}
							key={`breadcrumb__item-${breadcrumbItem.slug}`}
						>
							<span>{breadcrumbItem.name}</span>
						</div>
					);
				}
			})}
		</div>
	);
}
