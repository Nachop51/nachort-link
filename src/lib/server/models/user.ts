import { ObjectId } from 'mongodb'
import { collections } from '../db'
import type { Session } from '@auth/sveltekit'

export default class User {
	constructor(
		public email: string,
		public _id?: ObjectId | string,
		public name?: string,
		public handle?: string,
		public password?: string
	) {}

	static async create({ email, password }: Pick<User, 'email' | 'password'>) {
		const result = await collections.users.insertOne({ email, password })

		return result
	}

	static async get({
		handle,
		returnPassword
	}: Pick<User, 'handle'> & { returnPassword?: boolean }) {
		return await collections.users.findOne(
			{ $or: [{ email: handle }, { handle }] },
			{ projection: { password: returnPassword } }
		)
	}

	static async getById({ _id }: Pick<User, '_id'>) {
		return await collections.users.findOne(
			{ _id: new ObjectId(_id) },
			{ projection: { password: 0 } }
		)
	}

	// static async getByHandle({ handle }: Pick<User, 'handle'>) {
	// 	return await collections.users.findOne({
	// 		handle
	// 	})
	// }

	static async getHandle({ _id }: Pick<User, '_id'>) {
		const user = await collections.users.findOne(
			{ _id: new ObjectId(_id) },
			{ projection: { handle: 1 } }
		)

		if (user == null) {
			return null
		}

		return user.handle
	}

	static async registerHandle({ _id, handle }: Pick<User, '_id' | 'handle'>) {
		const result = await collections.users.updateOne(
			{ _id: new ObjectId(_id) },
			{ $set: { handle } }
		)

		return result.modifiedCount === 1
	}
}

export const getUser = async ({ locals }: { locals: App.Locals }) => {
	let session: Session | null
	try {
		session = await locals.auth()
	} catch {
		return null
	}

	if (session == null || session?.user == null) {
		return null
	}

	return session.user
}
