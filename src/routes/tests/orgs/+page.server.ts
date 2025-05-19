import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { data: orgs, error } = await locals.supabase
		.from('organizations')
		.select('*')
		.order('created_at');

	if (error) {
		console.error('Error fetching orgs:', error.message);
	}

	return {
		orgs: orgs ?? []
	};
};
