import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'
import { SvelteKitAuth } from '@auth/sveltekit'

import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from './db'

import GitHub from '@auth/sveltekit/providers/github'
import Credentials from '@auth/sveltekit/providers/credentials'
import Google from '@auth/sveltekit/providers/google'
import User from './models/user'
import bcrypt from 'bcrypt'

export const { handle } = SvelteKitAuth({
	trustHost: true,
	debug: false,
	adapter: MongoDBAdapter(client, {
		databaseName: 'nachort',
		collections: {
			Accounts: 'accounts',
			Sessions: 'sessions',
			Users: 'users',
			VerificationTokens: 'verificationTokens'
		}
	}),
	logger: {
		error(code, ...message) {
			console.error(...message)
			if (code.name === 'CredentialsSignin') {
				return
			} else {
				console.error(code, ...message)
			}
		}
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60 // 30 days
	},
	providers: [
		GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
		Google({
			clientId: GOOGLE_ID,
			clientSecret: GOOGLE_SECRET
		}),
		Credentials({
			credentials: {
				handle: {
					type: 'text',
					label: 'Handle',
					placeholder: 'john_doe'
				},
				password: {
					type: 'password',
					label: 'Password',
					placeholder: '*******'
				}
			},
			async authorize({ handle, password }) {
				if (typeof handle !== 'string' || typeof password !== 'string') {
					return null
				}

				const user = await User.get({ handle, returnPassword: true })

				if (user == null || user.password == null) {
					return null
				}

				if (!(await bcrypt.compare(password, user.password))) {
					return null
				}

				// return the user without the password
				delete user.password

				return { _id: user._id.toString(), id: user._id.toString() } as User & {
					_id: string
					id: string
				}
			}
		})
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (!token?.user && !user.id) {
				return null
			}

			if (token?.user != null) {
				// @ts-expect-error - the user object can contain the handle, so we need to check if it exists
				if (token.user?.handle != null) {
					return { user: token.user }
				}

				// @ts-expect-error - the user object if exists, will contain an _id
				const userHandle = await User.getHandle({ _id: token.user._id })

				if (userHandle == null) {
					return { user: token.user }
				}

				return {
					user: { ...token.user, handle: userHandle }
				}
			}

			const dbUser = await User.getById({ _id: user.id })

			if (dbUser == null) {
				return { user: token.user }
			}

			return {
				user: dbUser
			}
		},
		session: async ({ session, token }) => {
			// @ts-expect-error - if the user is not set, then the session user will be null, but if exists, it will be the user object
			session.user = token.user

			return session
		}
	},
	pages: {
		signIn: '/login'
	}
})
