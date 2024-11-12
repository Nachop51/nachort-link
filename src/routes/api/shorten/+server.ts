import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { getUser } from '$lib/server/models/user'
import Link from '$lib/server/models/link'
import { validateLink } from '$lib/schemas/link'
import { randomShortLink } from '$lib/utils/links'

export const POST: RequestHandler = async ({ locals, request }) => {
	let body: unknown

	try {
		body = await request.json()
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 })
	}

	const result = validateLink(body)

	if (!result.success) {
		return json({ error: JSON.parse(result.error.message) }, { status: 400 })
	}

	const { link, isPublic, customShortlink } = result.data

	const user = await getUser({ locals })

	if (customShortlink != null) {
		const existing = await Link.getCustom({ shortLink: customShortlink, handle: user?.handle })

		if (existing != null) {
			return json({ error: `Shortlink '${customShortlink}' already exists` }, { status: 400 })
		}
	}

	const shortLink = customShortlink ?? randomShortLink()

	const newLinkResult = await Link.create({
		link,
		isPublic: user ? isPublic : true,
		ownerId: user?._id ?? null,
		custom: customShortlink != null,
		shortLink,
		isAdmin: user?.isAdmin
	})

	if (newLinkResult == false) {
		return json({ error: 'Failed to create link' }, { status: 500 })
	}

	return json({ shortLink }, { status: 201 })
}
