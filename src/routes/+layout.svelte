<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<main class="min-h-screen bg-zinc-700 text-zinc-50">
	<div class="container mx-auto py-10">{@render children()}</div>
</main>
