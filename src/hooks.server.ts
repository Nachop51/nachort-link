import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private'
import { getDBUser } from '$lib/server/mongo'
import clientPromise from '$lib/server/mongoPromise'
import Credentials from '@auth/core/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/sveltekit/providers/github'
import { fail } from '@sveltejs/kit'

export const handle = SvelteKitAuth({
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: 'nachort',
		collections: {
			Accounts: 'accounts',
			Sessions: 'sessions',
			Users: 'users',
			VerificationTokens: 'verificationTokens'
		}
	}),
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Credentials({
			credentials: {
				handle: {
					type: 'text'
				},
				password: {
					type: 'password'
				}
			},
			authorize: async (credentials) => {
				const pwHash = credentials.password

				const user = await getDBUser(credentials.handle as string)

				if (user == null) {
					return fail(400, { message: 'user not found' })
				}

				if (pwHash !== user.password) {
					return fail(400, { message: 'user not found' })
				}

				return user
			}
		})
	]
})
