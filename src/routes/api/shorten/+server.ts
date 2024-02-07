import type { RequestHandler } from './$types'
import { createLink, getFullLink } from '$lib/server/mongo'
import { json } from '@sveltejs/kit'
import { randomShortLink } from '$lib/links'

export const GET: RequestHandler = async ({ url }) => {
	const link = url.searchParams.get('link')

	if (link == null) {
		return json({ error: 'No link provided' }, { status: 400 })
	}

	const redirectLink = await getFullLink(link)

	if (redirectLink == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	return json({ ...redirectLink })
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { link } = await request.json()

	let user = null

	const session = await locals.auth()

	if (session != null) {
		user = session.user
	}

	let shortLink = randomShortLink()

	while ((await getFullLink(shortLink)) != null) {
		shortLink = randomShortLink()
	}

	const result = await createLink({
		link,
		shortLink: shortLink,
		isPublic: true,
		ownerId: user?.id
	})

	if (!result) {
		return json({ error: 'Failed to create link' }, { status: 500 })
	}

	return json({ shortLink })
}
