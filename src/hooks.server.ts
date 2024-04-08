import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import clientPromise from '$lib/server/mongoPromise'
import { User } from '$lib/server/user'
import Credentials from '@auth/core/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { SvelteKitAuth } from '@auth/sveltekit'
import GitHub from '@auth/sveltekit/providers/github'
import Google from '@auth/sveltekit/providers/google'
import bcrypt from 'bcrypt'

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
				if (typeof credentials.handle !== 'string' || typeof credentials.password !== 'string') {
					return null
				}

				const user = await User.get({ handle: credentials.handle, password: 1 })

				if (user == null) {
					return null
				}

				const match = await bcrypt.compare(credentials.password, user.password)

				if (!match) {
					return null
				}

				user.id = user._id.toString()

				return {
					...user
				}
			}
		})
	],
	callbacks: {
		jwt: async ({ token }) => {
			const user = await User.getByID({ id: token.sub as string })

			token.user = {
				...user,
				id: token.sub
			}

			return token
		},
		// @ts-expect-error it recognizes that the definition is wrong, but it's actually correct
		session: async ({ session, token }) => {
			session.user = token.user

			return session
		}
	}
})
