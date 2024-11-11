import Link from '$lib/server/models/link'
import { getUser } from '$lib/server/models/user'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ locals, params }) => {
	const { shortLink } = params as { shortLink: string }

	const user = await getUser({ locals })
	const linkDoc = await Link.getNonCustom({ shortLink })

	if (linkDoc == null || (linkDoc.isPublic === false && user?._id !== linkDoc.ownerId)) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	return json({ ...linkDoc, _id: linkDoc._id.toString(), ownerId: linkDoc.ownerId?.toString() })
}

export const DELETE: RequestHandler = async ({ locals, params: { shortLink } }) => {
	const user = await getUser({ locals })

	if (user == null || shortLink == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const link = await Link.getCustom({ shortLink, handle: user.handle })

	if (link == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	const result = await Link.delete({ _id: link._id, ownerId: user._id })

	if (!result) {
		return json({ error: 'Failed to delete link' }, { status: 500 })
	}

	return new Response(null, { status: 204 })
}

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
