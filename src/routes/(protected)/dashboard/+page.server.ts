import { getLinksFromUser } from '$lib/server/mongo'
import type { Session } from '@auth/core/types'
import type { PageServerLoad } from './$types'
import type { UserId } from '$lib/types'

export const load = (async ({ locals }) => {
	const { user } = (await locals.auth()) as Session

	if (user == null) return {}

	const links = await getLinksFromUser(user as UserId)

	return { links }
}) satisfies PageServerLoad
