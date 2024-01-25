import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth()

	if (!session?.user) {
		return {
			status: 302,
			headers: {
				location: '/'
			}
		}
	}

	return {
		session
	}
}
