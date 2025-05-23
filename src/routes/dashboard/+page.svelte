<!-- This route is a protected route that is only accessible to authenticated users. -->

<script lang="ts">
	import Dashboard from './components/Dashboard.svelte';
	import type { PageData } from './$types';
	import Header from '../../components/Header.svelte';

	export let data: PageData;
</script>

<main class="min-h-screen bg-gradient-to-b from-white to-zinc-100 text-zinc-900">
	<div class="mx-auto w-full max-w-6xl px-6 py-10">
		<Header />

		<div class="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-lg">
			<Dashboard user={data.user} />
		</div>
	</div>
</main>
