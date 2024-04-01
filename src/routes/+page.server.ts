import { User } from '$lib/server/user'
import { fail, type Actions } from '@sveltejs/kit'

export const actions: Actions = {
	registerUser: async ({ request }) => {
		const formData = await request.formData()

		const email = formData.get('email')
		const password = formData.get('password')

		if (email == null || password == null) {
			return fail(400, { error: 'Missing required fields' })
		}

		if (typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, { error: 'Invalid input' })
		}

		if (email.length < 8 || password.length < 6) {
			return fail(400, { error: 'Email or password too short' })
		}

		const existingUser = await User.get({ handle: email })

		if (existingUser != null) {
			return fail(400, { error: 'Email already registered' })
		}

		const result = await User.create({ email, password })

		if (!result) {
			return fail(500, { error: 'Failed to create user' })
		}

		const createdUser = {
			email,
			password
		}

		return createdUser
	}
}
