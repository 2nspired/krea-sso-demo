<script lang="ts">
	export let user: Record<string, any> | null = null;

	// console.log('Dashboard component loaded');
	// $: console.log('Reactive user:', user);
</script>

<h1 class="mb-2 text-3xl font-extrabold text-gray-800">Dashboard</h1>
<p class="text-gray-700">Private route, only accessible to authenticated users.</p>

{#if user}
	<h2 class="mb-4 text-left text-lg font-semibold text-zinc-800">User Details</h2>
	<p class="text-gray-700">Attributes mapped from Google SSO</p>
	<ul class="w-full space-y-2 text-zinc-800">
		<li><strong>Email:</strong> {user.email}</li>
		<li><strong>First Name:</strong> {user.custom_claims?.first_name}</li>
		<li><strong>Last Name:</strong> {user.custom_claims?.last_name}</li>
		<li><strong>Phone:</strong> {user.phone}</li>
		<li><strong>Issuer (iss):</strong> {user.iss}</li>
	</ul>
{:else}
	<p class="text-zinc-600 italic">Loading user data...</p>
{/if}
