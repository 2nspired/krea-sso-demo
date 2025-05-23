<!-- This route is a protected route that is only accessible to authenticated users. -->

<script lang="ts">
	import Dashboard from './components/Dashboard.svelte';
	import type { PageData } from './$types';
	import Header from '../../components/Header.svelte';

	export let data: PageData;

	const isLoggedIn = data?.user;
	const isSSO = data?.user?.is_sso_user;
	const provider = data?.user?.app_metadata?.provider;
</script>

<main class="min-h-screen bg-gradient-to-b from-white to-zinc-100 text-zinc-900">
	<pre class="text-xs">
		{JSON.stringify(
			{
				isLoggedIn,
				isSSO,
				provider,
				user: data.user
			},
			null,
			2
		)}
		</pre>
	{#if isLoggedIn}
		<div class={`${isSSO ? 'bg-blue-500' : 'bg-orange-500'} px-4 py-2 text-white`}>
			<div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-1">
				{#if isSSO}
					<strong>SSO Login</strong>{provider ? ` (${provider})` : ''}
				{:else}
					<strong>Not an SSO login</strong>
				{/if}
			</div>
		</div>
	{/if}
	<div class="mx-auto w-full max-w-6xl px-6 py-10">
		<Header />

		<div class="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-lg">
			{#if data?.user?.user_metadata}
				<Dashboard user={data.user?.user_metadata} />
			{:else}
				<div>No user metadata</div>
			{/if}
		</div>
	</div>
</main>
