import { DB_NAME, LINKS_COLLECTION, USER_COLLECTION, MONGODB_URI } from '$env/static/private'
import { Collection, MongoClient, ServerApiVersion } from 'mongodb'
import type Link from './models/link'
import type User from './models/user'

if (!MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = MONGODB_URI
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true
	}
}

let client: MongoClient
let collections: {
	users: Collection<User>
	links: Collection<Link>
}

if (process.env.NODE_ENV === 'development') {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	const globalWithMongo = global as typeof globalThis & {
		_mongoClient?: MongoClient
		users?: Collection<User>
		links?: Collection<Link>
	}

	if (!globalWithMongo._mongoClient) {
		globalWithMongo._mongoClient = new MongoClient(uri, options)
	}

	if (!globalWithMongo.users) {
		globalWithMongo.users = globalWithMongo._mongoClient.db('nachort').collection('users')
	}

	if (!globalWithMongo.links) {
		globalWithMongo.links = globalWithMongo._mongoClient.db('nachort').collection('links')
	}

	client = globalWithMongo._mongoClient
	collections = {
		users: globalWithMongo.users,
		links: globalWithMongo.links
	}
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options)
	collections = {
		users: client.db(DB_NAME).collection(USER_COLLECTION),
		links: client.db(DB_NAME).collection(LINKS_COLLECTION)
	}
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client
export { collections }
