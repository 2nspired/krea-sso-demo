<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { orgs } = data;
</script>

<h1 class="mb-4 text-xl font-bold">Organizations</h1>

<ul class="space-y-2">
	{#each orgs as org}
		<li class="rounded border p-3">
			<strong>{org.name}</strong> — {org.domain} <br />
			SSO: {org.uses_sso ? '✅' : '❌'}, IDP: {org.idp}
		</li>
	{/each}
</ul>
