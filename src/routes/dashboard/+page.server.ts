import { getLinksFromUser } from '$lib/server/mongo'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { getUser } from '$lib/server/user'

export const load = (async ({ locals }) => {
	const user = await getUser({ locals })

	if (user == null || user?.id == null) throw error(401, 'Unauthorized')

	return {
		links: await getLinksFromUser({ userId: user.id })
	}
}) satisfies PageServerLoad
