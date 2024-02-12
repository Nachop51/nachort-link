import { MongoClient } from 'mongodb'
import { MONGO_URI } from '$env/static/private'
import { DB_NAME } from '$lib/constants'
import type { UserType, LinkType, LinkInput, UserInput, UserId } from '$lib/types'

const client = new MongoClient(MONGO_URI)
const db = client.db(DB_NAME)

export async function getDBUser(handle: string) {
	const collection = db.collection<UserType>('users')

	const user = await collection.findOne({ handle })

	return user
}

export async function createUser(user: UserInput) {
	const collection = db.collection<UserInput>('users')

	const result = await collection.insertOne(user)

	return result
}

export async function getFullLink(shortLink: string) {
	const collection = db.collection<LinkType>('links')

	const link = await collection.findOne({ shortLink }).then((data) => data)

	return link
}

export async function getLinksFromUser({ id: userId }: UserId) {
	const collection = db.collection<LinkType>('links')

	const links = await collection.find({ owner: userId }).toArray()

	return links
}

export async function createLink({ link, shortLink, isPublic, ownerId }: LinkInput) {
	const collection = db.collection<LinkInput>('links')

	const result = await collection.insertOne({ link, shortLink, isPublic, ownerId })

	return result
}
