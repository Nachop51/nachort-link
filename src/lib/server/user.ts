import { MONGO_URI } from '$env/static/private'
import { DB_NAME } from '$lib/constants'
import type { UserInput, UserType } from '$lib/types'
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(MONGO_URI)
const db = client.db(DB_NAME)

export class User {
	static async create(user: UserInput) {
		const collection = db.collection<UserInput>('users')

		const result = await collection.insertOne(user)

		return result
	}

	static async get({ handle, password }: { handle: string; password: number }) {
		const collection = db.collection<UserType>('users')

		const user = await collection.findOne(
			{ $or: [{ handle: handle }, { email: handle }] },
			{ projection: { password } }
		)

		return user
	}

	static async getByID({ id }: { id: string }) {
		const collection = db.collection<UserType>('users')

		return await collection.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })
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
