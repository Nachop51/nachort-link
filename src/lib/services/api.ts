import type Link from '$lib/server/models/link'

export async function changeVisibility({
	shortLink,
	isPublic
}: Pick<Link, 'shortLink' | 'isPublic'>): Promise<boolean> {
	try {
		const res = await fetch(`/api/shorten/${shortLink}/visibility`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ isPublic })
		})

		return res.ok
	} catch {
		return false
	}
}

export async function createShortlink({
	link,
	isPublic,
	custom,
	customShortlink
}: Pick<Link, 'link' | 'isPublic' | 'custom'> & {
	customShortlink?: Link['shortLink']
}): Promise<string> {
	const payload = {
		link,
		isPublic: !isPublic ? false : undefined,
		custom: custom ? custom : undefined,
		customShortlink: custom ? customShortlink : undefined
	}

	try {
		const res = await fetch(`/api/shorten/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})

		const json = await res.json()

		if (res.ok) {
			return (json as Link).shortLink
		}

		throw new Error(json.error)
	} catch (e) {
		if (e instanceof Error) {
			throw Error(e.message)
		}

		throw Error('Failed to create link, please try again later.')
	}
}

export async function deleteShortLink({ shortLink }: Pick<Link, 'shortLink'>) {
	try {
		const res = await fetch(`/api/shorten/${shortLink}`, {
			method: 'DELETE'
		})

		return res.ok
	} catch {
		return false
	}
}

export async function updateLink({ link, shortLink }: Pick<Link, 'link' | 'shortLink'>) {
	try {
		const res = await fetch(`/api/shorten/${shortLink}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ link })
		})

		return res.ok
	} catch {
		return false
	}
}

export async function updateShortLink({
	shortLink,
	newShortLink: customShortlink
}: Pick<Link, 'shortLink'> & { newShortLink: Link['shortLink'] }) {
	try {
		const res = await fetch(`/api/shorten/${shortLink}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ customShortlink })
		})

		return res.ok
	} catch {
		return false
	}
}
