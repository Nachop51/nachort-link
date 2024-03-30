import { isValidHttpUrl } from '$lib/links'
import { Link } from '$lib/server/links'
import { getUser } from '$lib/server/user'
import type { Actions } from '@sveltejs/kit'

export const actions: Actions = {
	create: async ({ request, locals, url }) => {
		const formData = await request.formData()

		const link = formData.get('link') as string

		if (!isValidHttpUrl(link)) {
			return { error: 'Invalid URL', shortLink: null }
		}

		const isPublic = formData.get('isPublic')

		if (isPublic == null) {
			return { error: 'Invalid visibility', shortLink: null }
		}

		const user = await getUser({ locals })

		const shortLink = await Link.create({
			link,
			isPublic: isPublic.valueOf() as boolean,
			ownerId: user?.id ?? null
		})

		if (shortLink == null) {
			return { error: 'Failed to create link', shortLink: null }
		}

		return { sucess: true, shortLink: `${url.origin}/${shortLink}` }
	}
}
