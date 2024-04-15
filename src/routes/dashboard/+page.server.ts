import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { Link } from '$lib/server/links'
import type { LinkType } from '$lib/types'

export const load = (async ({ parent, depends }) => {
	const { user } = await parent()

	if (user == null || user?.id == null) {
		throw redirect(302, '/')
	}

	const links = await Link.getFromUser({ userId: user.id })

	depends('user-links')

	return {
		links: links.map((link) => ({
			...link,
			_id: link._id.toString()
		})) as LinkType[]
	}
}) satisfies PageServerLoad
