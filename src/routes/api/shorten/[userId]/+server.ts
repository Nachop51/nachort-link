import type { RequestHandler } from './$types'
import { getLinks, createLink } from '$lib/server/mongo'

export const GET: RequestHandler = async ({ params }) => {
	const { userId } = params

	console.log(userId)

	return new Response()
}
