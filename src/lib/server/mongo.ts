import { MongoClient } from 'mongodb'
import { MONGO_URI } from '$env/static/private'
import { DB_NAME } from '$lib/constants'
import type { DBUser, Link, LinkInput, UserInput } from '$lib/types'

const client = new MongoClient(MONGO_URI)

export async function getDBUser(handle: string) {
	const db = client.db(DB_NAME)
	const collection = db.collection<DBUser>('users')

	const user = await collection.findOne({ handle })

	return user
}

export async function createUser(user: UserInput) {
	const db = client.db(DB_NAME)
	const collection = db.collection<UserInput>('users')

	const result = await collection.insertOne(user)

	return result
}

export async function getLinks(user: DBUser) {
	const db = client.db(DB_NAME)
	const collection = db.collection<Link>('links')

	const links = await collection.find({ owner: user.id }).toArray()

	return links
}

export async function createLink(link: LinkInput) {
	const db = client.db(DB_NAME)
	const collection = db.collection<LinkInput>('links')

	const result = await collection.insertOne(link)

	return result
}
