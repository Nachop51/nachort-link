import type { LinkType } from '$lib/types'

export const changeVisibility = async ({
	linkId,
	isPublic
}: {
	linkId: string
	isPublic: boolean
}) => {
	try {
		const res = await fetch(`/api/shorten`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ linkId, isPublic })
		})

		return res.ok
	} catch (error) {
		console.error(error)
		return false
	}
}

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

export const deleteLink = async ({ linkId }: { linkId: string }) => {
	try {
		const res = await fetch(`/api/shorten`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ linkId })
		})

		return res.ok
	} catch (error) {
		console.error(error)
		return false
	}
}
