import { browser } from '$app/environment'
import type { LinkType } from '$lib/types'

export class Api {
	constructor(private fetch: typeof window.fetch = window.fetch) {
		this.fetch = browser ? window.fetch : fetch
	}

	async changeVisibility({ shortLink, isPublic }: { shortLink: string; isPublic: boolean }) {
		try {
			const res = await this.fetch(`/api/shorten/${shortLink}`, {
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

	async createShortlink({ link, isPublic }: { link: string; isPublic: boolean }) {
		try {
			const res = await this.fetch(`/api/shorten/`, {
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

	async deleteShortLink({ shortLink }: { shortLink: string }) {
		try {
			const res = await this.fetch(`/api/shorten/${shortLink}`, {
				method: 'DELETE'
			})

			return res.ok
		} catch (error) {
			console.error(error)
			return false
		}
	}

	async getShortLink(shortLink: string) {
		try {
			const res = await this.fetch(`/api/shorten/${shortLink}`)

			if (res.ok) {
				return (await res.json()) as LinkType
			}
		} catch (error) {
			console.error(error)
		}
		return null
	}
}
