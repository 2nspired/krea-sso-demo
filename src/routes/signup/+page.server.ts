import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		if (!email || !email.includes('@')) {
			console.error('[LOGIN] Invalid email submitted:', email);
			return redirect(303, '/login/error');
		}

		const { supabase } = locals;

		const { error } = await supabase.auth.signUp({ email, password });

		if (error) {
			return fail(400, { error: error.message });
		}

		throw redirect(303, '/dashboard');
	}
};
