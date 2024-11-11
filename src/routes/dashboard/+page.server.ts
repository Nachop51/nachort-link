import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import Link from '$lib/server/models/link'

export const load = (async ({ parent }) => {
	const { user } = await parent()

	if (user == null || user?._id == null) {
		throw redirect(302, '/')
	}

	const links = await Link.getFromUser({ ownerId: user._id })

	return {
		user,
		links: links.map((link) => ({
			...link,
			_id: link._id.toString(),
			ownerId: link.ownerId?.toString()
		})) as Array<Link>
	}
}) satisfies PageServerLoad
