<!-- TODO: -->
<script lang="ts">
	export let user: Record<string, any> | null = null;

	console.log('Dashboard component loaded');
	$: console.log('Reactive user:', user);
</script>

<h1 class="mb-2 text-3xl font-extrabold text-gray-800">Dashboard</h1>
<p class="text-red">Private route, only accessible to authenticated users.</p>

{#if user}
	<h2 class="mb-4 text-lg font-semibold text-zinc-800">User Details</h2>
	<ul class="w-full space-y-2 text-zinc-800">
		<li><strong>Email:</strong> {user.email}</li>
		<li><strong>Email Verified:</strong> {user.email_verified ? 'Yes' : 'No'}</li>
		<li><strong>Full Name:</strong> {user.full_name}</li>
		<li><strong>Name:</strong> {user.name}</li>
		<li><strong>Phone Verified:</strong> {user.phone_verified ? 'Yes' : 'No'}</li>
		<li><strong>Provider ID:</strong> {user.provider_id}</li>
		<li><strong>Subject (sub):</strong> {user.sub}</li>
		<li><strong>Issuer (iss):</strong> {user.iss}</li>
		<li><strong>Custom Claims (hd):</strong> {user.custom_claims?.hd}</li>
	</ul>
{:else}
	<p class="text-zinc-600 italic">Loading user data...</p>
{/if}
