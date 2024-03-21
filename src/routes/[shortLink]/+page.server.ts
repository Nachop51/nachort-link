import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { registerVisit } from '$lib/server/mongo'
import { Api } from '$lib/services/api'

export const load = (async ({ params, fetch }) => {
	const { shortLink } = params

	const linkData = await new Api(fetch).getShortLink(shortLink)

	if (linkData == null) {
		throw error(404, 'Link not found')
	}

	await registerVisit({ linkId: linkData._id })
	throw redirect(302, linkData.link)
}) satisfies PageServerLoad
