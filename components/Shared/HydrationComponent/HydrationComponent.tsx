import { ReactElement, useState, useEffect } from 'react';

const HydrationComponent = ({ children, still }: { children: ReactElement; still?: boolean }) => {
	const [ssr, setSSR] = useState(false);
	useEffect(() => {
		setSSR(true);
	});

	if (ssr || still) {
		return <>{children}</>;
	} else {
		return null;
	}
};

export { HydrationComponent };
