// +page.ts
import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	return { to: url.searchParams.get('to') };
};
