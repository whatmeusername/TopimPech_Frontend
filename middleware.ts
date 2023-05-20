import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PROXY_URL, getData } from './app/layout';

export async function middleware(request: NextRequest) {
	const existingAuthToken = request.cookies.get('UID_TOKEN');
	const response = NextResponse.next();
	if (!existingAuthToken) {
		const authToken = await getData(`${PROXY_URL}session/get`);
		response.cookies.set('UID_TOKEN', authToken.UID, { expires: new Date(authToken.expires), httpOnly: true });
	}

	return response;
}
