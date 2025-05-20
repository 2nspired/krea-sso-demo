<script lang="ts">
	import { onMount } from 'svelte';

	export let data: { to: string | null };
	const to = data.to;

	onMount(() => {
		const timeout = setTimeout(() => {
			if (to) {
				window.location.href = to;
			}
		}, 3000);

		return () => clearTimeout(timeout);
	});
</script>

<div class="flex h-screen items-center justify-center bg-gray-100">
	{#if to}
		<div class="rounded-lg bg-white p-8 text-center shadow-md">
			<h1 class="mb-2 text-xl font-semibold text-gray-800">Redirecting to your SSO login...</h1>
			<p class="text-gray-600">
				Please wait while we redirect you to your organization's login page.
			</p>
			<p class="mt-4 text-sm text-gray-400">
				If you are not redirected, <a class="text-blue-600 underline" href={to}>click here</a>.
			</p>
		</div>
	{:else}
		<p class="text-center text-red-500">Missing redirect URL. Please return to login.</p>
	{/if}
</div>
