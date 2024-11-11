import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { HASH_SALT_ROUNDS } from '$lib/constants'
import User from '$lib/server/models/user'
import bcrypt from 'bcrypt'
import { validateSignIn } from '$lib/schemas/user'

export const load = (async ({ parent }) => {
	const { user } = await parent()

	if (user != null) {
		throw redirect(302, '/')
	}
}) satisfies PageServerLoad

export const actions = {
	registerUser: async ({ request }) => {
		const formData = await request.formData()

		const formEmail = formData.get('email')
		const formPassword = formData.get('password')

		const result = validateSignIn({ email: formEmail, password: formPassword })

		if (!result.success) {
			return fail(400, { error: result.error.message })
		}

		const { email, password } = result.data

		const existingUser = await User.get({ handle: email, returnPassword: false })

		if (existingUser != null) {
			return fail(400, { error: 'Email already registered' })
		}

		// Generate secure password hash
		const hashedPassword = await bcrypt.hash(password, HASH_SALT_ROUNDS)

		// Create a user with the hashed password
		const opResult = await User.create({ email, password: hashedPassword })

		if (!opResult) {
			return fail(500, { error: 'Failed to create user' })
		}

		return {
			email,
			password,
			success: true
		}
	}
}
