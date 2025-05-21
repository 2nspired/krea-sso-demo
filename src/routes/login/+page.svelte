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
			console.error('Supabase signInWithIdToken (google) error:', error?.message);
			return;
		}

		window.location.href = '/';
	};

	onMount(async () => {
		await generateNonceAndHash();

		function renderGoogleButton() {
			if (window.google?.accounts?.id) {
				window.google.accounts.id.initialize({
					client_id: PUBLIC_GOOGLE_CLIENT_ID,
					callback: handleSignInWithGoogle,
					nonce: hashedNonce
				});
				window.google.accounts.id.renderButton(document.getElementById('google-signin-btn'), {
					type: 'standard',
					shape: 'rectangular',
					theme: 'outline',
					text: 'continue_with',
					size: 'large',
					logo_alignment: 'left',
					width: 300
				});
			}
		}

		if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.onload = renderGoogleButton;
			document.head.appendChild(script);
		} else {
			renderGoogleButton();
		}
	});

	let email = '';
</script>

<main class="min-h-screen bg-gradient-to-b from-white to-zinc-100 text-zinc-900">
	<div class="mx-auto flex h-full w-full max-w-6xl flex-col">
		<header class="flex items-center justify-between px-6 py-8">
			<nav>
				<a class="font-medium text-blue-600 hover:underline" href="/">← Back to Home</a>
			</nav>
		</header>

		<div class="flex grow flex-col items-center justify-center px-4 pb-20">
			<div class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
				<h1 class="mb-2 text-center text-3xl font-bold">Login to Krea</h1>
				<p class="mb-6 text-center text-zinc-600">Choose a method to continue</p>

				<div class="mb-6 flex flex-col items-center space-y-4">
					<div id="google-signin-btn" data-width="300"></div>
				</div>

				<div class="my-6 flex items-center justify-between text-sm text-zinc-400">
					<hr class="w-full border-zinc-300" />
					<span class="px-3">or</span>
					<hr class="w-full border-zinc-300" />
				</div>

				<form method="POST" action="?/login" class="flex flex-col gap-4">
					<label class="flex flex-col text-sm font-medium">
						Email address
						<input
							class="mt-1 rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
							bind:value={email}
							type="email"
							name="email"
							required
						/>
					</label>
					<button
						class="mt-1 rounded-md bg-blue-600 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
						type="submit"
					>
						Continue
					</button>
				</form>
			</div>
		</div>
	</div>
</main>
