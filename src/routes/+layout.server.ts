import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { getUser } from '$lib/server/models/user'
import { DATA_SERVER_NAMES } from '$lib/constants'
import type { User } from '@auth/sveltekit'

export const load = (async ({ locals, url, depends, cookies }) => {
	depends(DATA_SERVER_NAMES.USER)
	let user: User | null = null

	try {
		user = await getUser({ locals })
	} catch {
		const allCookies = cookies.getAll()

		for (const { name } of allCookies) {
			cookies.delete(name, { path: '/' })
		}
	}

	if (user != null) {
		if (user.handle == null && url.pathname !== '/create-handle') {
			throw redirect(302, '/create-handle')
		}
	}

	return { user }
}) satisfies LayoutServerLoad
