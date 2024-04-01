import { MONGO_URI } from '$env/static/private'
import { DB_NAME } from '$lib/constants'
import type { UserInput, UserType } from '$lib/types'
import { MongoClient } from 'mongodb'

const client = new MongoClient(MONGO_URI)
const db = client.db(DB_NAME)

export class User {
	static async create(user: UserInput) {
		const collection = db.collection<UserInput>('users')

		const result = await collection.insertOne(user)

		return result
	}

	static async get({ handle }: { handle: string }) {
		const collection = db.collection<UserType>('users')

		const user = await collection.findOne({ $or: [{ handle: handle }, { email: handle }] })

		return user
	}
}

export const getUser = async ({ locals }: { locals: App.Locals }) => {
	const session = await locals.auth()

	if (session == null || session?.user == null) {
		return null
	}

	const user = session.user

	return user
}
