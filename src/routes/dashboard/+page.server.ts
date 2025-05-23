import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const result = await locals.supabase.auth.getUser();

	const {
		data: { user }
	} = result;

	return {
		user: user
	};
};
