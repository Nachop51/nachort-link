import type { RequestHandler } from './$types'
import { MongoClient } from 'mongodb'
import { MONGO_URI } from '$env/static/private'

const client = new MongoClient(MONGO_URI)

export const GET: RequestHandler = async () => {
	try {
		const database = client.db('nachort')
		const users = database.collection('users')

		const user = users.find({})

		for await (const doc of user) {
			console.log(doc)
		}
	} catch (error) {
		console.error(error)
	}

	return new Response()
}
