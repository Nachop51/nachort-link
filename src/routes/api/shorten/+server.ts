import type { RequestHandler } from './$types'
import { createLink, getFullLink } from '$lib/server/mongo'
import { json } from '@sveltejs/kit'
import { isValidHttpUrl, randomShortLink } from '$lib/links'
import { getUser } from '$lib/server/user'

export const POST: RequestHandler = async ({ locals, request }) => {
	const { link, isPublic } = await request.json()

	if (isValidHttpUrl(link) === false) {
		return json({ error: 'Invalid link' }, { status: 400 })
	}

	const user = await getUser({ locals })

	let shortLink = randomShortLink()

	while ((await getFullLink({ shortLink })) != null) {
		shortLink = randomShortLink()
	}

	const result = await createLink({
		link,
		shortLink: shortLink,
		isPublic: user != null ? isPublic : true,
		ownerId: user?.id
	})

	if (!result) {
		return json({ error: 'Failed to create link' }, { status: 500 })
	}

	return json({ shortLink }, { status: 201 })
}
