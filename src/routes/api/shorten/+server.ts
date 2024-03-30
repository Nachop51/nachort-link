import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { isValidHttpUrl } from '$lib/links'
import { getUser } from '$lib/server/user'
import { Link } from '$lib/server/links'

export const POST: RequestHandler = async ({ locals, request }) => {
	const { link, isPublic } = (await request.json()) as { link: string; isPublic: boolean }

	if (isValidHttpUrl(link) === false) {
		return json({ error: 'Invalid link' }, { status: 400 })
	}

	const user = await getUser({ locals })

	const shortLink = await Link.create({ link, isPublic, ownerId: user?.id ?? null })

	if (shortLink == null) {
		return json({ error: 'Failed to create link' }, { status: 500 })
	}

	return json({ shortLink }, { status: 201 })
}
