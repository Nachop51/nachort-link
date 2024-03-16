import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { LinkType } from '$lib/types'

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

	if (linkData.isPublic === true) {
		throw redirect(302, linkData.link)
	}

	if (session == null || linkData.ownerId !== session?.user?.id) {
		throw error(404, 'Link not found')
	}

	throw redirect(302, linkData.link)
}) satisfies PageServerLoad
