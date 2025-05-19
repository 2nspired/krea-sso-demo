<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

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
			window.location.href = '/dashboard';
		}
	};

	onMount(async () => {
		await generateNonceAndHash();

		(window as any).handleSignInWithGoogle = handleSignInWithGoogle;

		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		document.head.appendChild(script);
	});
</script>

<main class="p-8">
	<h1 class="mb-4 text-2xl font-bold">Sign in</h1>
	<p class="mb-6 text-zinc-300">Sign in with your Google Workspace account.</p>

	<!-- Google Identity prebuilt UI -->
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
		class="g_id_signin max-w-60"
		data-type="standard"
		data-shape="pill"
		data-theme="outline"
		data-text="continue_with"
		data-size="large"
		data-logo_alignment="left"
	></div>
</main>
