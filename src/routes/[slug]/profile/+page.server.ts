import User from '$lib/server/models/user'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params: { slug: handle } }) => {
	const user = await User.getProfile({ handle })

	if (user == null) {
		throw error(404, 'User not found')
	}

	return {
		user
	}
}) satisfies PageServerLoad
