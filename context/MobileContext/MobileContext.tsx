'use client';
import { ReactElement, createContext, useContext } from 'react';
import useWindowSize from '../../hooks/useWindowSize';

const MobileContextData = createContext<boolean>(false);

function DetectMobile(userAgent: string): boolean {
	const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

	return toMatch.some((item) => userAgent.match(item));
}

function MobileContext({ children, userAgentString }: { children: ReactElement; userAgentString: string }): ReactElement {
	return <MobileContextData.Provider value={DetectMobile(userAgentString)}>{children}</MobileContextData.Provider>;
}

function useMobileContext(): boolean {
	return useContext(MobileContextData);
}

function useMobile(size: number): boolean {
	const { width } = useWindowSize();
	const isMobile = useMobileContext();
	return isMobile || (width !== undefined && width <= size);
}

export { MobileContext, MobileContextData, useMobileContext, useMobile };
