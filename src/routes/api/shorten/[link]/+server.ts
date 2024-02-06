import type { RequestHandler } from './$types'
import { getLinks } from '$lib/server/mongo'
import { json } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params, locals }) => {
	const { link } = params

	const session = await locals.auth()

	if (session == null) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	const user = session.user

	return json({ user })
}
