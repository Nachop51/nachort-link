import { fail, redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import User, { getUser } from '$lib/server/models/user'
import { validateHandle } from '$lib/schemas/user'

export const load = (async ({ parent }) => {
	const { user } = await parent()

	if (user == null || user.handle != null) {
		throw redirect(302, '/')
	}

	return {}
}) satisfies PageServerLoad

export const actions: Actions = {
	checkAvailability: async ({ request, locals }) => {
		const sessionUser = await getUser({ locals })

		if (sessionUser == null) {
			return fail(401, { error: 'Unauthorized' })
		}

		const formData = await request.formData()

		const formHandle = formData.get('handle')

		const result = validateHandle({ handle: formHandle })

		if (!result.success) {
			return fail(400, { error: result.error.message })
		}

		const { handle } = result.data

		const existingUser = await User.get({ handle, returnPassword: false })

		if (existingUser != null) {
			return fail(400, { error: 'Handle already taken' })
		}

		return { handle }
	},
	confirmUsername: async ({ request, locals }) => {
		const sessionUser = await getUser({ locals })

		if (sessionUser == null) {
			return fail(401, { error: 'Unauthorized' })
		}

		const formData = await request.formData()

		const formHandle = formData.get('handle')

		const result = validateHandle({ handle: formHandle })

		if (!result.success) {
			return fail(400, { error: result.error.message })
		}

		const { handle } = result.data

		const existingUserHandle = await User.get({ handle, returnPassword: false })

		if (existingUserHandle != null) {
			return fail(400, { error: 'Handle already taken' })
		}

		const registered = await User.registerHandle({ _id: sessionUser._id as string, handle })

		if (!registered) {
			return fail(500, { error: 'Failed to register handle' })
		}

		return { handle, registered }
	}
}
