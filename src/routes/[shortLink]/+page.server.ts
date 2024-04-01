import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { Link } from '$lib/server/links'
import { getUser } from '$lib/server/user'

export const load = (async ({ params, locals }) => {
	const { shortLink } = params

	const linkData = await Link.getFull({ shortLink })

	if (linkData == null) {
		throw error(404, 'Link not found')
	}

	const user = await getUser({ locals })

	if (linkData.isPublic === false && user?.id !== linkData.ownerId) {
		throw error(404, 'Link not found')
	}

	await Link.registerVisit({ linkId: linkData._id })
	throw redirect(302, linkData.link)
}) satisfies PageServerLoad
