import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { getUser, User } from '$lib/server/user'

export const load = (async ({ parent }) => {
	const { user } = await parent()

	if (user == null || user?.handle != null) {
		throw redirect(302, '/')
	}

	return {}
}) satisfies PageServerLoad

export const actions: Actions = {
	checkAvailability: async ({ request }) => {
		const formData = await request.formData()

		const handle = formData.get('handle')

		if (handle == null) {
			return fail(400, { error: 'Missing required fields' })
		}

		if (typeof handle !== 'string') {
			return fail(400, { error: 'Handle must be a string' })
		}

		if (handle.length < 3) {
			return fail(400, { error: 'Handle too short' })
		}

		const existingUser = await User.get({ handle, password: false })

		if (existingUser != null) {
			return fail(400, { error: 'Handle already taken' })
		}

		return { handle }
	},
	confirmUsername: async ({ request, locals }) => {
		const formData = await request.formData()

		const handle = formData.get('handle') as string

		if (handle == null) {
			return fail(400, { error: 'Missing required fields' })
		}

		if (typeof handle !== 'string') {
			return fail(400, { error: 'Invalid input' })
		}

		if (handle.length < 3) {
			return fail(400, { error: 'Handle too short' })
		}

		const sessionUser = await getUser({ locals })

		if (sessionUser == null) {
			return fail(401, { error: 'Unauthorized' })
		}

		const user = await User.get({ handle, password: false })

		if (user != null) {
			return fail(400, { error: 'Handle already taken' })
		}

		const registered = await User.registerHandle({ id: sessionUser.id as string, handle })

		if (!registered) {
			return fail(500, { error: 'Failed to register handle' })
		}

		return { handle, registered }
	}
}
