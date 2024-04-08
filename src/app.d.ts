// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { DefaultSession } from '@auth/core/types'

declare global {
	namespace App {
		interface Session extends DefaultSession {
			user:
				| ({
						handle?: string | null
				  } & DefaultSession['user'])
				| null
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
