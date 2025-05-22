import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			console.error(error);
			return redirect(303, '/login/error');
		} else {
			return redirect(303, '/');
		}
	},

	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email')?.toString();

		if (!email || !email.includes('@')) {
			console.error('Missing or invalid email');
			return redirect(303, '/login/error');
		}

		const domain = email.split('@')[1];

		const { data: org, error: orgError } = await supabase
			.from('organizations')
			.select('uses_sso, sso_redirect_url')
			.eq('domain', domain)
			.maybeSingle();

		if (orgError) {
			console.error(orgError);
			return redirect(303, '/login/error');
		}

		if (!org) {
			return redirect(303, `/signup?email=${encodeURIComponent(email)}`);
		}

		if (org.uses_sso) {
			if (org.sso_redirect_url) {
				// If they use Google Workspace SSO, redirect the browser there
				return redirect(303, `/login/sso-redirect?to=${encodeURIComponent(org.sso_redirect_url)}`);
			}

			// fallback: SP-initiated login via Supabase
			const { error } = await supabase.auth.signInWithSSO({
				domain,
				options: {
					redirectTo: 'krea-sso-demo.vercel.app/'
				}
			});

			if (error) {
				console.error('SSO login error:', error.message);
				return redirect(303, '/login/error');
			}

			return new Response(null, { status: 204 }); // or redirect to dashboard
		}

		// fallback: org does not use SSO
		return redirect(303, '/login/error');
	}
};
