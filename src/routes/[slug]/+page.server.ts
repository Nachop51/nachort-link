import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import Link from '$lib/server/models/link'
import { getUser } from '$lib/server/models/user'

export const load = (async ({ params, locals }) => {
	const { slug: shortLink } = params

	const linkData = await Link.getNonCustom({ shortLink })

	if (linkData == null) {
		throw error(404, 'Link not found')
	}

	const user = await getUser({ locals })

	if (linkData.isPublic === false && user?._id != linkData.ownerId) {
		throw error(404, 'Link not found')
	}

	await Link.registerVisit({ _id: linkData._id })
	throw redirect(302, linkData.link)
}) satisfies PageServerLoad
