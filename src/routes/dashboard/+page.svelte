<script lang="ts">
	import Dashboard from './components/Dashboard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="min-h-screen bg-gradient-to-b from-white to-zinc-100 text-zinc-900">
	<div class="mx-auto w-full max-w-6xl px-6 py-10">
		<header class="mb-8 flex items-center justify-between">
			<nav>
				<a class="font-medium text-blue-600 hover:underline" href="/">← Back to Home</a>
			</nav>
		</header>

		<div class="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-lg">
			<Dashboard user={data.user} />
		</div>
	</div>
</main>
