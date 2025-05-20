<script lang="ts">
	import Dashboard from './components/Dashboard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	class="flex h-full items-center justify-center bg-gradient-to-bl from-gray-700 via-gray-900 to-black px-4 py-12"
>
	<header class="flex items-center justify-between p-4">
		<nav>
			<a class="hover:text-blue-400" href="/">Home</a>
		</nav>
	</header>
	<div
		class="flex w-full max-w-md flex-col items-center space-y-8 rounded-2xl bg-zinc-400/90 p-8 shadow-2xl"
	>
		<Dashboard user={data.user} />
	</div>
</div>
