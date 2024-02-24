import type { RequestHandler } from './$types'
import {
	createLink,
	deleteLink,
	getFullLink,
	getFullLinkById,
	updatePublicLink
} from '$lib/server/mongo'
import { json } from '@sveltejs/kit'
import { randomShortLink } from '$lib/links'
import { getUser } from '$lib/server/user'

export const GET: RequestHandler = async ({ url }) => {
	const link = url.searchParams.get('link')

	if (link == null) {
		return json({ error: 'No link provided' }, { status: 400 })
	}

	const redirectLink = await getFullLink({ shortLink: link })

	if (redirectLink == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	return json({ ...redirectLink })
}

export const POST: RequestHandler = async ({ request, locals }) => {
	const { link } = await request.json()

	const user = await getUser({ locals })

	let shortLink = randomShortLink()

	while ((await getFullLink({ shortLink })) != null) {
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

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const user = await getUser({ locals })

	if (user == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { linkId } = (await request.json()) as { linkId?: string }

	if (linkId == null) {
		return json({ error: 'No linkId provided' }, { status: 400 })
	}

	const link = await getFullLinkById({ linkId })

	if (link == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	if (user.id !== link.ownerId) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await deleteLink({ linkId: link._id.toString() })

	if (!result) {
		return json({ error: 'Failed to delete link' }, { status: 500 })
	}

	return json({ success: true })
}

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const user = await getUser({ locals })

	if (user == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const { linkId, isPublic } = (await request.json()) as { linkId?: string; isPublic?: boolean }

	if (linkId == null || typeof isPublic !== 'boolean') {
		return json(
			{ error: 'Plese provide a valid linkId and a boolean isPublic property.' },
			{ status: 400 }
		)
	}

	const link = await getFullLinkById({ linkId })

	if (link == null) {
		return json({ error: 'Link not found' }, { status: 404 })
	}

	if (user.id !== link.ownerId) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const result = await updatePublicLink({ linkId: link._id.toString(), isPublic })

	if (!result) {
		return json({ error: 'Failed to update link' }, { status: 500 })
	}

	return json({ success: true })
}
