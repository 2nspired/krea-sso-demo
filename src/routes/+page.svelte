<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

	type CredentialResponse = {
		credential: string;
		select_by: any;
		state: any;
	};

	// nonce is sent to supabase, hasedNonce is sent to google
	let nonce = '';
	let hashedNonce = '';

	// Helper to hash the nonce
	async function generateNonceAndHash() {
		// Generate random base64 nonce
		const array = new Uint8Array(32);
		crypto.getRandomValues(array);
		nonce = btoa(String.fromCharCode(...array));

		// Hash the nonce (SHA-256, hex)
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
			nonce // use the original, unhashed nonce here
		});
		if (error) {
			console.error('Supabase signInWithIdToken error:', error.message);
		} else {
			window.location.href = '/dashboard';
		}
	};

	onMount(async () => {
		await generateNonceAndHash();

		// Expose the handler globally for Google callback
		(window as any).handleSignInWithGoogle = handleSignInWithGoogle;

		// Load Google Identity Services script
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
	<!-- Google Code Generator: https://developers.google.com/identity/gsi/web/tools/configurator -->
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
