<script lang="ts">
	export let data;
	const { supabase, session } = data;
	const userName = session?.user?.user_metadata?.full_name || session?.user?.email || null;

	async function logout() {
		await supabase.auth.signOut();
		location.reload();
	}
</script>

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

	<a
		href="/dashboard"
		class="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
	>
		Go to Dashboard
	</a>
</main>
