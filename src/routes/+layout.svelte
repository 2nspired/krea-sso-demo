<script lang="ts">
	import '../app.css';
	import { invalidate, replaceState } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	function parseHashParams(hash: string): Record<string, string> {
		return Object.fromEntries(
			hash
				.substring(1)
				.split('&')
				.map((kv) => kv.split('='))
		);
	}

	onMount(() => {
		// 1. Check if the URL hash contains an access_token
		if (window.location.hash.includes('access_token')) {
			const params = parseHashParams(window.location.hash);

			// 2. Set the session in Supabase
			supabase.auth
				.setSession({
					access_token: params.access_token,
					refresh_token: params.refresh_token
				})
				.then(() => {
					// 3. Optionally, clean up the URL
					replaceState(window.location.pathname, {});
					// 4. Invalidate to refresh session
					invalidate('supabase:auth');
					location.reload();
				});
		}

		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<main class="h-screen bg-zinc-800 text-zinc-50">
	<div class="h-full">{@render children()}</div>
</main>
