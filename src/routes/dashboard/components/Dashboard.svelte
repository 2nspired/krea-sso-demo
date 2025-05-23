<script lang="ts">
	export let user: Record<string, any> | null = null;
</script>

<h1 class="mb-4 text-3xl font-bold text-zinc-900">Dashboard</h1>
<p class="mb-6 text-zinc-600">Private route — only accessible to authenticated users.</p>

{#if user}
	<h2 class="mb-2 text-lg font-semibold text-zinc-800">User Details</h2>
	<ul class="space-y-1 text-sm text-zinc-700">
		<li><strong>Email:</strong> {user.email}</li>
		<li><strong>First Name:</strong> {user.custom_claims?.first_name}</li>
		<li><strong>Last Name:</strong> {user.custom_claims?.last_name}</li>
		<li><strong>Phone:</strong> {user.phone}</li>
		<li><strong>Issuer (iss):</strong> {user.iss}</li>
	</ul>
{:else}
	<p class="text-zinc-500 italic">Loading user data...</p>
{/if}
