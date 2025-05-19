<script>
	let { children } = $props();
</script>

<div class="flex h-full flex-col">
	<header>
		<nav>
			<a href="/">Home</a>
		</nav>
	</header>
	{@render children()}
</div>
