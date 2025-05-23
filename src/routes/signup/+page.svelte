<script lang="ts">
	import { page } from '$app/state';
	import Header from '../../components/Header.svelte';

	const email = page.url.searchParams.get('email') ?? '';
</script>

<main class="h-full min-h-screen bg-gradient-to-b from-white to-zinc-100 text-zinc-900">
	<div class="mx-auto flex h-full w-full max-w-6xl flex-col py-10">
		<Header />
		<div class="flex grow flex-col items-center justify-center px-4 pb-20">
			<div class="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl">
				<h1 class="mb-2 text-center text-3xl font-bold">Complete Your Signup</h1>
				<p class="mb-6 text-center text-zinc-600">Create your account to get started</p>

				<form method="POST" class="flex flex-col gap-4">
					<label class="flex flex-col text-sm font-medium">
						Email address
						<input
							class="mt-1 border-none px-3 py-2 focus:ring-0"
							type="text"
							name="email"
							id="email"
							value={email}
							readonly
							tabindex="-1"
						/>
					</label>

					<label class="flex flex-col text-sm font-medium">
						Password
						<input
							class="mt-1 rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
							type="password"
							name="password"
							id="password"
							required
						/>
					</label>

					<button
						type="submit"
						class="mt-1 rounded-md bg-blue-600 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
					>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	</div>
</main>
