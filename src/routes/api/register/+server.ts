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

	const existingUser = await getDBUser(handle)

	if (existingUser != null) {
		return json({ error: 'User already exists' }, { status: 400 })
	}

	const result = await createUser({ handle, password })

	if (!result) {
		return json({ error: 'Failed to create user' }, { status: 500 })
	}

	const createdUser = {
		id: result.insertedId,
		handle
	}

	return json({ user: createdUser })
}
