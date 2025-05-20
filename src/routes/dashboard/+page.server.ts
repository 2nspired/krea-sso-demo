// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	console.log('Load function called');
	const result = await locals.supabase.auth.getUser();
	console.log('Supabase getUser result:', result);

	const {
		data: { user }
	} = result;

	console.log('Server load user:', user);

	return {
		user: user?.user_metadata
	};
};
