import { getUser } from '$lib/server/user'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
	const user = await getUser({ locals })

	if (user != null) {
		if (user.handle == null && url.pathname !== '/create-handle') {
			throw redirect(302, '/create-handle')
		}
	}

	return {
		user
	}
}
