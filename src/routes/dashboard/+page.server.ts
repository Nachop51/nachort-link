import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { Link } from '$lib/server/links'

export const load = (async ({ parent, depends }) => {
	const { user } = await parent()

	if (user == null || user?.id == null) throw error(401, 'Unauthorized')

	const links = await Link.getFromUser({ userId: user.id })

	depends('user-links')

	return {
		links: links.map((link) => ({
			...link,
			_id: link._id.toString()
		}))
	}
}) satisfies PageServerLoad
