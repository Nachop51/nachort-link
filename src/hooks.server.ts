import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/sveltekit/providers/github'
// import Credentials from '@auth/core/providers/credentials'
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private'

export const handle = SvelteKitAuth({
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })

		// Credentials({
		// 	// You can specify which fields should be submitted, by adding keys to the `credentials` object.
		// 	// e.g. domain, username, password, 2FA token, etc.
		// 	credentials: {
		// 		username: {},
		// 		password: {}
		// 	},
		// 	authorize: async (credentials) => {
		// 		const user = null

		// 		// logic to salt and hash password
		// 		// const pwHash = saltAndHashPassword(credentials.password)
		// 		// logic to verify if user exists
		// 		// user = await getUserFromDb(credentials.username, pwHash)

		// 		if (!user) {
		// 			throw new Error('User not found.')
		// 		}

		// 		// return json object with the user data
		// 		return user
		// 	}
		// })
	]
})
