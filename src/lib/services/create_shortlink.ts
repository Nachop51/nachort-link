import type { LinkType } from '$lib/types'

export const createShortlink = async (link: string) => {
	try {
		const res = await fetch(`/api/shorten/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ link })
		})

		if (res.ok) {
			const data = (await res.json()) as LinkType

			return data.shortLink
		}

		throw new Error('Failed to create link, please try again later.')
	} catch (e) {
		if (e instanceof Error) {
			throw Error(e.message)
		}

		throw Error('Failed to create link, please try again later.')
	}
}
