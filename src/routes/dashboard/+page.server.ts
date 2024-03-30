import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { getUser } from '$lib/server/user'
import { Link } from '$lib/server/links'

export const load = (async ({ locals }) => {
	const user = await getUser({ locals })

	if (user == null || user?.id == null) throw error(401, 'Unauthorized')

	const links = await Link.getFromUser({ userId: user.id })

	return {
		links: links.map((link) => ({
			...link,
			_id: link._id.toString()
		}))
	}
}) satisfies PageServerLoad
