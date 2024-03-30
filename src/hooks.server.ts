import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import clientPromise from '$lib/server/mongoPromise'
import { User } from '$lib/server/user'
import Credentials from '@auth/core/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/sveltekit/providers/github'
import Google from '@auth/sveltekit/providers/google'

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
	// @ts-expect-error it throws a weird version error
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
		Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET }),
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

				const user = await User.get(credentials.handle)

				if (user == null) {
					return null
				}

				if (pwHash !== user.password) {
					return null
				}

				user.id = user._id.toString()
				user.name = user.handle ?? user?.name ?? user?.email ?? 'Unknown'

				return user
			}
		})
	],
	callbacks: {
		// @ts-expect-error it recognizes that the definition is wrong, but it's actually correct
		session: async ({ session, token }) => {
			// console.log({ session, token })
			if (session?.user) {
				session.user.id = token.sub
			}

			return session
		}
	}
})
