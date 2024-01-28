import { ReactElement } from 'react';

function HeadFavicon(): ReactElement {
	return (
		<>
			<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
			<link rel="icon" type="image/png" sizes="228x228" href="/favicon/favicon-228x228.png" />
			<link rel="icon" type="image/png" sizes="195x195" href="/favicon/favicon-195x195.png" />
			<link rel="icon" type="image/png" sizes="152x152" href="/favicon/favicon-152x152.png" />
			<link rel="icon" type="image/png" sizes="144x144" href="/favicon/favicon-144x144.png" />
			<link rel="icon" type="image/png" sizes="128x128" href="/favicon/favicon-128x128.png" />
			<link rel="icon" type="image/png" sizes="120x120" href="/favicon/favicon-120x120.png" />
			<link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
			<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
			<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
			<link rel="icon" href="/favicon/favicon.svg" />
			<link rel="icon" type="image/png" href="/favicon/favicon.png" />
			<link rel="manifest" href="/favicon/site.webmanifest" />
			<link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" />
			<link rel="shortcut icon" href="/favicon/favicon.ico" />
			<meta name="msapplication-TileColor" content="#da532c" />
			<meta name="msapplication-config" content="/favicon/browserconfig.xml" />
			<meta name="theme-color" content="#ffffff" />
		</>
	);
}

export { HeadFavicon };
