import { error } from '@sveltejs/kit'
import { MongoClient } from 'mongodb'
import { MONGO_URI } from '$env/static/private'

let clientPromise: Promise<MongoClient>

try {
	const client = new MongoClient(MONGO_URI)
	clientPromise = client.connect()
} catch (err) {
	error(502, 'MongoDB connection error')
}

export default clientPromise
