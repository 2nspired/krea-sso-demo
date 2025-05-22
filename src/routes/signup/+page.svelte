<script lang="ts">
	import { page } from '$app/state';

	const email = page.url.searchParams.get('email') ?? '';
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
		<h1 class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
			Complete Your Signup
		</h1>

		<form method="POST" class="space-y-4">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>Email</label
				>
				<input
					id="email"
					name="email"
					type="text"
					value={email}
					readonly
					tabindex="-1"
					class="mt-1 w-full rounded-md border border-gray-300 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
			>
				Sign Up
			</button>
		</form>
	</div>
</div>
