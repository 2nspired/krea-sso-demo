// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from './database.types.ts'; // import generated types
declare global {
	interface Window {
		google?: {
			accounts?: {
				id?: {
					initialize: (...args: unknown[]) => void;
					renderButton: (...args: unknown[]) => void;
					// add other methods if needed
				};
			};
		};
	}
	namespace App {
		// interface Error {}

		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession: () => Promise<{ session: Session | null; user: User | null }>;
			session: Session | null;
			user: User | null;
		}
		interface PageData {
			session: Session | null;
		}

		// interface PageState {}
		// interface Platform {}
		// interface Error {}
		// interface Locals {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
