import { validatePartialLink } from '$lib/schemas/link'
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

	let body: unknown

	try {
		body = await request.json()
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 })
	}

	const result = validatePartialLink(body)

	if (!result.success) {
		return json({ error: JSON.parse(result.error.message) }, { status: 400 })
	}

	const { link: newLink, customShortlink } = result.data

	if (newLink == null && customShortlink == null) {
		return json({ error: 'No valid data provided' }, { status: 400 })
	}

	const linkDoc = await Link.getCustom({ shortLink, handle: user.handle })

	if (linkDoc == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	if (customShortlink != null) {
		const existing = await Link.getCustom({ shortLink: customShortlink, handle: user.handle })

		if (existing != null) {
			return json({ error: `Shortlink '${customShortlink}' already exists` }, { status: 400 })
		}
	}

	const custom = user?.isAdmin === true ? false : linkDoc.custom || shortLink != null

	const opResult = Link.update({
		shortLink: customShortlink ?? shortLink,
		link: newLink ?? linkDoc.link,
		_id: linkDoc._id,
		custom
	})

	if (opResult == null) {
		return json({ error: 'Failed to update link' }, { status: 500 })
	}

	return json({
		_id: linkDoc._id.toString(),
		ownerId: linkDoc.ownerId?.toString(),
		shortLink: customShortlink ?? shortLink,
		link: newLink ?? linkDoc.link,
		isPublic: linkDoc.isPublic
	})
}
