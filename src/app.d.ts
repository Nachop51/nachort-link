// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@auth/sveltekit' {
	interface User {
		_id: string
		handle?: string
		name?: string | null
		email?: string | null
		image?: string | null
		isAdmin?: boolean
	}
}

export {}
