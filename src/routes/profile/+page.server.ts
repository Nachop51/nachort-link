import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import User from '$lib/server/models/user'

export const load = (async ({ parent }) => {
	const { user } = await parent()

	if (user == null) {
		throw redirect(303, '/login')
	}

	const userProfile = await User.getProfile({ handle: user.handle })

	if (userProfile == null) {
		throw error(404, 'User not found')
	}

	return {
		user: userProfile
	}
}) satisfies PageServerLoad
