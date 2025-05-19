<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	import { goto } from '$app/navigation';

	export let data;
	const { supabase } = data;

	type CredentialResponse = {
		credential: string;
		select_by: any;
		state: any;
	};

	// google requires a hashed nonce, non-hashed must go to supabase.
	let nonce = '';
	let hashedNonce = '';
	async function generateNonceAndHash() {
		const array = new Uint8Array(32);
		crypto.getRandomValues(array);
		nonce = btoa(String.fromCharCode(...array));

		const encoder = new TextEncoder();
		const encodedNonce = encoder.encode(nonce);
		const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	const handleSignInWithGoogle = async (response: CredentialResponse) => {
		const { data, error } = await supabase.auth.signInWithIdToken({
			provider: 'google',
			token: response.credential,
			nonce
		});
		if (error) {
			console.error('Supabase signInWithIdToken error:', error.message);
		} else {
			window.location.href = '/';
		}
	};

	let login_uri = '';
	onMount(async () => {
		await generateNonceAndHash();

		login_uri = `${window.location.origin}/google-login`;

		(window as any).handleSignInWithGoogle = handleSignInWithGoogle;

		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		document.head.appendChild(script);
	});
	let email = '';

	async function handleLogin(event: Event) {
		event.preventDefault();
		const domain = email.split('@')[1];

		// check if the domain is in the organizations table and if it is, redirect to the sso_redirect_url stored in subabase.
		const { data: org, error: orgError } = await supabase
			.from('organizations')
			.select('uses_sso, sso_redirect_url')
			.eq('domain', domain)
			.single();

		if (orgError) {
			console.error('Error fetching organization info:', orgError.message);
			alert('Unable to verify organization. Please try again later.');
			return;
		}

		if (org?.uses_sso) {
			if (org?.sso_redirect_url) {
				goto(`/login/sso-redirect?to=${encodeURIComponent(org.sso_redirect_url)}`);
				return;
			}
			// fallback to supabase SSO login (SP-initiated)
			const { error } = await supabase.auth.signInWithSSO({
				domain,
				options: {
					redirectTo: `${window.location.origin}/dashboard`
				}
			});
			if (error) {
				console.error('SSO redirect failed:', error.message);
				alert('Login failed. Please try again.');
			}
			return;
		}

		// optional: fallback to email/password login flow
		alert('This organization does not support SSO login.');
	}
</script>

<div
	class="flex h-full items-center justify-center bg-gradient-to-bl from-gray-700 via-gray-900 to-black px-4 py-12"
>
	<div
		class="flex w-full max-w-md flex-col items-center space-y-8 rounded-2xl bg-zinc-400/90 p-8 shadow-2xl"
	>
		<h1 class="text-3xl font-extrabold text-gray-800">Welcome</h1>
		<p class="text-lg text-zinc-800">Log in or sign up to continue</p>
		<div class="flex w-full flex-col items-center space-y-4">
			<div
				id="g_id_onload"
				data-client_id={PUBLIC_GOOGLE_CLIENT_ID}
				data-context="signin"
				data-ux_mode="popup"
				data-callback="handleSignInWithGoogle"
				data-nonce={hashedNonce}
				data-auto_select="true"
				data-itp_support="true"
				data-use_fedcm_for_prompt="true"
			></div>
			<div
				class="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="continue_with"
				data-size="large"
				data-logo_alignment="left"
				data-width="280"
				data-onsuccess="handleSignInWithGoogle"
			></div>
		</div>
		<div class="my-2 flex w-full items-center">
			<div class="flex-grow border-t border-zinc-900"></div>
			<span class="mx-4 text-zinc-900">or</span>
			<div class="flex-grow border-t border-zinc-900"></div>
		</div>
		<form on:submit|preventDefault={handleLogin} class="flex w-full flex-col gap-5">
			<label class="flex flex-col font-medium text-gray-700">
				Email
				<input
					class="mt-1 w-full rounded-md border-2 border-gray-200 px-3 py-2 transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
					bind:value={email}
					type="email"
					required
				/>
			</label>
			<button
				class="mt-2 w-full rounded-md bg-blue-600 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
				type="submit">Continue</button
			>
		</form>
	</div>
</div>
