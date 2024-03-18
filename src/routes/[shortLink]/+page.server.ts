import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { LinkType } from '$lib/types'
import { registerVisit } from '$lib/server/mongo'

export const load = (async ({ params, locals, fetch }) => {
	const { shortLink } = params

	const session = await locals.auth()

	const linkData = await fetch(`/api/shorten?link=${shortLink}`)
		.then((res) => {
			if (res.ok) {
				return res.json() as Promise<LinkType>
			}
			return null
		})
		.then((data) => data)
		.catch(() => null)

	if (linkData == null) {
		throw error(404, 'Link not found')
	}

	// If there is no session, or the link owner is not the same as the session user, and the link is not public
	// then throw a 404
	// If the link is public, or the above conditions are not met, then redirect to the link

	if (session == null || linkData.ownerId !== session?.user?.id) {
		if (linkData.isPublic === false) {
			throw error(404, 'Link not found')
		}
	}

	await registerVisit({ linkId: linkData._id })
	throw redirect(302, linkData.link)
}) satisfies PageServerLoad
