import type { LinkType } from '$lib/types'

export async function changeVisibility({ shortLink, isPublic }: { shortLink: string; isPublic: boolean }) {
	try {
		const res = await fetch(`/api/shorten/${shortLink}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ isPublic })
		})

		return res.ok
	} catch (error) {
		console.error(error)
		return false
	}
}

export async function createShortlink({ link, isPublic }: { link: string; isPublic: boolean }) {
	try {
		const res = await fetch(`/api/shorten/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ link, isPublic })
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

export async function deleteShortLink({ shortLink }: { shortLink: string }) {
	try {
		const res = await fetch(`/api/shorten/${shortLink}`, {
			method: 'DELETE'
		})

		return res.ok
	} catch (error) {
		console.error(error)
		return false
	}
}

export async function getShortLink(shortLink: string) {
	try {
		const res = await fetch(`/api/shorten/${shortLink}`)

		if (res.ok) {
			return (await res.json()) as LinkType
		}
	} catch (error) {
		console.error(error)
	}
	return null
}
