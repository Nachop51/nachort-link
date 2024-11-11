import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'
import { getUser } from '$lib/server/models/user'
import { DATA_SERVER_NAMES } from '$lib/constants'

export const load = (async ({ locals, url, depends }) => {
	depends(DATA_SERVER_NAMES.USER)
	const user = await getUser({ locals })

	if (user != null) {
		if (user.handle == null && url.pathname !== '/create-handle') {
			throw redirect(302, '/create-handle')
		}
	}

	return { user }
}) satisfies LayoutServerLoad
