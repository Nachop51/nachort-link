import type { RequestHandler } from './$types'
import { getUser } from '$lib/server/models/user'
import { json } from '@sveltejs/kit'
import Link from '$lib/server/models/link'

export const PATCH: RequestHandler = async ({ locals, request, params: { shortLink } }) => {
	const user = await getUser({ locals })

	if (user == null || shortLink == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	let body: { isPublic?: boolean }

	try {
		body = await request.json()
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 })
	}

	const { isPublic } = body

	if (isPublic == null || typeof isPublic !== 'boolean') {
		return json({ error: 'No valid `isPublic` boolean provided' }, { status: 400 })
	}

	const link = await Link.getCustom({ shortLink, handle: user.handle })

	if (link == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	if (link.isPublic === isPublic) {
		return json({ error: 'No change detected' }, { status: 400 })
	}

	const result = await Link.updatePublic({ _id: link._id, isPublic })

	if (!result) {
		return json({ error: 'Failed to update link' }, { status: 500 })
	}

	return json({ success: true })
}
