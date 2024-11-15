import { ObjectId, type WithId } from 'mongodb'
import { collections } from '../db'
import type User from './user'

export default class Link {
	constructor(
		public link: string,
		public shortLink: string,
		public ownerId: ObjectId | string | null,
		public isPublic: boolean,
		public custom: boolean,
		public _id?: ObjectId | string,
		public visits?: number
	) {}

	static async create({
		link,
		ownerId,
		isPublic,
		shortLink,
		custom,
		isAdmin
	}: Pick<Link, 'link' | 'ownerId' | 'isPublic' | 'shortLink' | 'custom'> & Pick<User, 'isAdmin'>) {
		try {
			const result = await collections.links.insertOne({
				shortLink,
				link,
				ownerId: ownerId != null ? new ObjectId(ownerId) : null,
				isPublic,
				custom: isAdmin ? false : custom
			})

			if (result.acknowledged === false) {
				throw new Error('Failed to create link')
			}
		} catch {
			return false
		}

		return true
	}

	static async delete({ _id, ownerId }: Pick<Link, '_id' | 'ownerId'>) {
		try {
			const result = await collections.links.deleteOne({
				_id: new ObjectId(_id),
				ownerId: new ObjectId(ownerId as string)
			})

			return result.deletedCount
		} catch {
			return false
		}
	}

	static async update({
		_id,
		shortLink,
		link,
		custom
	}: Partial<Link> & Pick<Link, '_id' | 'custom'>) {
		const result = await collections.links.updateOne(
			{ _id: new ObjectId(_id) },
			{ $set: { shortLink, link, custom } }
		)

		return result.acknowledged
	}

	static async getNonCustom({ shortLink }: Pick<Link, 'shortLink'>) {
		let link: WithId<Link> | null = null

		link = await collections.links.findOne({
			shortLink,
			custom: false
		})

		return link
	}

	static async getCustom({ handle, shortLink }: Pick<User, 'handle'> & Pick<Link, 'shortLink'>) {
		const cursor = collections.links.aggregate([
			{
				$lookup: {
					from: 'users',
					localField: 'ownerId',
					foreignField: '_id',
					as: 'owner'
				}
			},
			{
				$match: {
					'owner.handle': handle,
					shortLink: shortLink
				}
			},
			{
				$project: {
					_id: 1,
					link: 1,
					isPublic: 1,
					ownerId: 1
				}
			}
		])

		const link = await cursor.next()

		return link
	}

	static async registerVisit({ _id }: Pick<Link, '_id'>) {
		const result = await collections.links.updateOne(
			{ _id: new ObjectId(_id) },
			{ $inc: { visits: 1 } }
		)

		return result.acknowledged
	}

	static async updatePublic({ _id, isPublic }: Pick<Link, '_id' | 'isPublic'>) {
		const result = await collections.links.updateOne(
			{ _id: new ObjectId(_id) },
			{ $set: { isPublic } }
		)

		return result.acknowledged
	}

	static async getFromUser({ ownerId }: Pick<Link, 'ownerId'>) {
		const links = await collections.links
			.find({ ownerId: new ObjectId(ownerId as string) })
			.toArray()

		return links
	}
}
