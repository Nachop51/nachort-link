import { MongoClient, ObjectId } from 'mongodb'
import { MONGO_URI } from '$env/static/private'
import { DB_NAME, LINKS_COLLECTION } from '$lib/constants'
import type { UserType, LinkType, LinkInput, UserInput, UserIdType } from '$lib/types'
import { error } from '@sveltejs/kit'

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

export async function getFullLink({ shortLink }: { shortLink: string }) {
	const collection = db.collection<LinkType>(LINKS_COLLECTION)

	const link = await collection.findOne({ shortLink })

	return link
}

export async function getFullLinkById({ linkId }: { linkId: UserIdType }) {
	const collection = db.collection(LINKS_COLLECTION)

	const link = await collection.findOne({ _id: new ObjectId(linkId) })

	return link
}

export async function getLinksFromUser({ userId }: { userId: UserIdType }) {
	const collection = db.collection<LinkType>(LINKS_COLLECTION)

	const links = (await collection.find({ ownerId: userId }).toArray()).map((link) => ({
		...link,
		_id: link._id.toString()
	}))

	if (links == null) {
		throw error(404, 'No links found')
	}

	return links
}

export async function createLink({ link, shortLink, isPublic, ownerId }: LinkInput) {
	const collection = db.collection<LinkInput>(LINKS_COLLECTION)

	const result = await collection.insertOne({ link, shortLink, isPublic, ownerId })

	return result
}

export async function deleteLink({ linkId }: { linkId: string }) {
	const collection = db.collection(LINKS_COLLECTION)

	const deleted = await collection.deleteOne({ _id: new ObjectId(linkId) })

	return deleted.deletedCount === 1
}

export async function updatePublicLink({
	linkId,
	isPublic
}: {
	linkId: UserIdType
	isPublic: boolean
}) {
	const collection = db.collection(LINKS_COLLECTION)

	const result = await collection.updateOne(
		{ _id: new ObjectId(linkId) },
		{ $set: { isPublic: isPublic } }
	)

	return result.acknowledged
}

export async function registerVisit({ linkId }: { linkId: string }) {
	const collection = db.collection(LINKS_COLLECTION)

	const result = await collection.updateOne({ _id: new ObjectId(linkId) }, { $inc: { visits: 1 } })

	console.log({ result })

	return result.acknowledged
}
