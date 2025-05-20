<script lang="ts">
	import { onMount } from 'svelte';

	export let data;
	const { supabase, session } = data;
	const userName = session?.user?.user_metadata?.full_name || session?.user?.email || null;

	async function logout() {
		await supabase.auth.signOut();
		location.reload();
	}

	let checked = false;

	onMount(() => {
		// Wait a short time to allow session pickup after SSO
		setTimeout(() => {
			if (!session || !userName) {
				location.href = '/login';
			}
			checked = true;
		}, 500); // 500ms delay, adjust as needed
	});
</script>

{#if !checked && (!session || !userName)}
	<p>Checking authentication...</p>
{:else}
	<main class="p-8">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-2xl font-bold">Welcome to Krea SSO Demo</h1>
			{#if userName}
				<div class="flex items-center gap-4 text-sm text-zinc-200">
					<span>Hi, {userName}</span>
					<button on:click={logout} class="text-red-400 hover:underline">Log out</button>
				</div>
			{:else}
				<a href="/login" class="text-sm text-blue-400 hover:underline">Login / Sign up</a>
			{/if}
		</div>

		<p class="text-zinc-300">This is the landing page for the app.</p>
	</main>
{/if}
