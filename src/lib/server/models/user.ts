import { ObjectId } from 'mongodb'
import { collections } from '../db'
import type { Session } from '@auth/sveltekit'
import type Link from './link'

export default class User {
	constructor(
		public email: string,
		public _id?: ObjectId | string,
		public name?: string,
		public handle?: string,
		public password?: string,
		public image?: string,
		public isAdmin?: boolean
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

	static async getProfile({ handle }: Pick<User, 'handle'>) {
		const result = await collections.users
			.aggregate([
				{ $match: { handle } },
				{
					$lookup: {
						from: 'links',
						let: { userId: '$_id' },
						pipeline: [
							{
								$match: {
									$expr: { $and: [{ $eq: ['$ownerId', '$$userId'] }, { $eq: ['$isPublic', true] }] }
								}
							}
						],
						as: 'links'
					}
				},
				{
					$addFields: {
						_id: { $toString: '$_id' },
						links: {
							$map: {
								input: '$links',
								as: 'link',
								in: {
									$mergeObjects: [
										'$$link',
										{
											_id: {
												$toString: '$$link._id'
											},
											ownerId: {
												$toString: '$$link.ownerId'
											}
										}
									]
								}
							}
						},
						linkCount: { $size: '$links' }
					}
				},
				{
					$project: {
						password: 0
					}
				}
			])
			.toArray()

		if (result == null || result.length === 0) {
			return null
		}

		const user = {
			_id: result[0]._id,
			handle: result[0].handle,
			image: result[0].image,
			customLinks: result[0].links.filter((link: Link) => link.custom),
			links: result[0].links.filter((link: Link) => !link.custom),
			linkCount: result[0].linkCount
		} as Pick<User, '_id' | 'handle' | 'image'> & {
			customLinks: Link[]
			links: Link[]
			linkCount: number
		}

		return user
	}

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

	if (session == null || session.user == null) {
		return null
	}

	return session.user
}
