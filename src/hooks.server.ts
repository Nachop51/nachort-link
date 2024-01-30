import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private'
import { getDBUser } from '$lib/server/mongo'
import clientPromise from '$lib/server/mongoPromise'
import Credentials from '@auth/core/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/sveltekit/providers/github'

export const handle = SvelteKitAuth({
	debug: false,
	logger: {
		error(code, ...message) {
			if (code.name === 'CredentialsSignin') {
				return
			} else {
				console.error(...message)
			}
		}
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
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
			name: 'credentials',
			credentials: {
				handle: {
					type: 'text',
					label: 'Handle',
					placeholder: 'john.doe'
				},
				password: {
					type: 'password',
					label: 'Password'
				}
			},
			authorize: async (credentials) => {
				const pwHash = credentials.password

				if (typeof credentials.handle !== 'string') {
					return null
				}

				const user = await getDBUser(credentials.handle)

				if (user == null) {
					return null
				}

				if (pwHash !== user.password) {
					return null
				}

				return user
			}
		})
	]
})
