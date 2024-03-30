import { MONGO_URI } from '$env/static/private'
import { DB_NAME, LINKS_COLLECTION } from '$lib/constants'
import { randomShortLink } from '$lib/links'
import type { LinkInput, LinkType, UserIdType } from '$lib/types'
import { MongoClient, ObjectId } from 'mongodb'

const client = new MongoClient(MONGO_URI)
const db = client.db(DB_NAME)

export class Link {
	static async create({
		link,
		isPublic,
		ownerId
	}: {
		link: string
		isPublic: boolean
		ownerId: UserIdType | null
	}) {
		let shortLink = randomShortLink()

		while ((await Link.getFull({ shortLink })) != null) {
			shortLink = randomShortLink()
		}
		const collection = db.collection<LinkInput>(LINKS_COLLECTION)

		const result = await collection.insertOne({
			link,
			shortLink,
			isPublic: ownerId != null ? isPublic : true,
			ownerId
		})

		if (result == null) {
			return null
		}

		return shortLink
	}

	static async delete({ linkId }: { linkId: LinkType['_id'] }) {
		const collection = db.collection(LINKS_COLLECTION)

		const deleted = await collection.deleteOne({ _id: new ObjectId(linkId) })

		return deleted.deletedCount === 1
	}

	static async updatePublic({ linkId, isPublic }: { linkId: LinkType['_id']; isPublic: boolean }) {
		const collection = db.collection(LINKS_COLLECTION)

		const result = await collection.updateOne(
			{ _id: new ObjectId(linkId) },
			{ $set: { isPublic: isPublic } }
		)

		return result.acknowledged
	}

	static async registerVisit({ linkId }: { linkId: LinkType['_id'] }) {
		const collection = db.collection(LINKS_COLLECTION)

		const result = await collection.updateOne(
			{ _id: new ObjectId(linkId) },
			{ $inc: { visits: 1 } }
		)

		return result.acknowledged
	}

	static async getFull({ shortLink }: { shortLink?: string }) {
		if (shortLink == null) {
			return null
		}

		const collection = db.collection<LinkType>(LINKS_COLLECTION)

		const link = await collection.findOne({ shortLink })

		return link
	}

	static async getFromUser({ userId }: { userId: UserIdType }) {
		const collection = db.collection<LinkType>(LINKS_COLLECTION)

		const links = await collection.find({ ownerId: userId }).toArray()

		if (links == null) {
			return []
		}

		return links
	}
}
