'use client';

import type { ReactElement } from 'react';
import './WidthLimiter.scss';
import { usePathname } from 'next/navigation';

export default function WidthLimiter({ children }: { children: ReactElement }): ReactElement {
	const pathname = usePathname();
	if (pathname === '/') {
		return children;
	}
	return <div className="width__limiter">{children}</div>;
}
