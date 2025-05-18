<script lang="ts">
	import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
</script>

<h1>Env Test</h1>

<ul>
	<li>Supabase URL: {PUBLIC_SUPABASE_URL === PUBLIC_SUPABASE_URL ? '✅' : '❌'}</li>
	<li>Supabase Anon Key: {PUBLIC_SUPABASE_ANON_KEY === PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}</li>
</ul>
