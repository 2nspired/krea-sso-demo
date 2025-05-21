<script lang="ts">
	export let data;
	const { supabase, session } = data;
	const userName = session?.user?.user_metadata?.full_name || session?.user?.email || null;

	async function logout() {
		await supabase.auth.signOut();
		location.reload();
	}
</script>

<main class="min-h-screen bg-gradient-to-b from-white to-zinc-100 text-zinc-900">
	<div class="mx-auto w-full max-w-6xl px-6 py-10">
		<header class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold">Krea SSO Demo</h1>
			{#if userName}
				<div class="flex items-center gap-4 text-sm text-zinc-700">
					<span>Hi, {userName}</span>
					<button
						on:click={logout}
						class="rounded-md border border-transparent px-3 py-1.5 text-red-600 hover:border-red-400 hover:underline"
					>
						Log out
					</button>
				</div>
			{:else}
				<a href="/login" class="text-sm font-medium text-blue-600 hover:underline">
					Login / Sign up
				</a>
			{/if}
		</header>

		<a
			href="/dashboard"
			class="inline-block rounded-md bg-blue-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
		>
			Dashboard (protected)
		</a>

		<section class="mt-12 rounded-xl border border-zinc-200 bg-white p-8 text-zinc-800 shadow-lg">
			<h2 class="mb-4 text-xl font-semibold">What this demo shows</h2>
			<ul class="list-inside list-disc space-y-2 text-zinc-700">
				<li>✨ Google Workspace SSO as IdP</li>
				<li>🧠 Email domain check to determine SSO vs standard login</li>
				<li>🔁 Reroute to SSO based on domain match</li>
			</ul>

			<div class="mt-6 border-t border-zinc-200 pt-4 text-sm text-zinc-600">
				<p>
					ℹ️ Note: Supabase treats Google login and SSO login as separate identities, even if the
					email is the same. This means that extra logic is needed to avoid duplicate accounts if
					your org uses SSO. This demo highlights that complexity and how you might handle it.
				</p>
			</div>
		</section>
	</div>
</main>
