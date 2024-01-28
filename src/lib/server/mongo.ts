import { MongoClient } from 'mongodb'
import { MONGO_URI } from '$env/static/private'
import { DB_NAME } from '$lib/constants'
import type { DBUser } from '$lib/types'

export async function getMongoClient() {
	const client = new MongoClient(MONGO_URI)

	return await client.connect()
}

export async function getDBUser(handle: string) {
	const client = await getMongoClient()

	const db = client.db(DB_NAME)
	const collection = db.collection<DBUser>('users')

	const user = await collection.findOne({ handle })

	return user
}
