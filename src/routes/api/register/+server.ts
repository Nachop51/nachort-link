import type { RequestHandler } from './$types'
import { createUser, getDBUser } from '$lib/server/mongo'
import { json } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request }) => {
	const { handle, password } = await request.json()

	if (handle == null || password == null) {
		return json({ error: 'Missing required fields' }, { status: 400 })
	}

	if (typeof handle !== 'string' || typeof password !== 'string') {
		return json(
			{ error: 'Invalid field types, handle and password must be strings' },
			{ status: 400 }
		)
	}

	await createUser({ handle, password })

	const createdUser = await getDBUser(handle)

	if (createdUser == null) {
		return json({ error: 'Failed to create user' }, { status: 500 })
	}

	const user = {
		id: createdUser._id,
		handle: createdUser.handle
	}

	return json({ ...user })
}
