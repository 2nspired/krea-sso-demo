<script>
	let { children } = $props();
</script>

<div class="flex h-full flex-col bg-gradient-to-bl from-gray-700 via-gray-900 to-black">
	{@render children()}
</div>
