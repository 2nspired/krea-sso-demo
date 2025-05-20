<script>
	let { children } = $props();
</script>

<div class="flex h-full flex-col bg-gradient-to-bl from-gray-700 via-gray-900 to-black">
	<header class="flex items-center justify-between p-4">
		<nav>
			<a class="hover:text-blue-400" href="/">Home</a>
		</nav>
	</header>
	{@render children()}
</div>
