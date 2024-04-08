import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ parent }) => {
	const { user } = await parent()

	if (user == null) {
		throw error(404, 'User not found')
	}

	return {}
}) satisfies PageServerLoad
