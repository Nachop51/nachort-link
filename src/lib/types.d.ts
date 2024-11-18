import type { LINK_FILTERS } from './constants'
import type User from './models/user'

export enum THEME {
	LIGHT = 'light',
	DARK = 'dark'
}

export type LinkFilterValues = (typeof LINK_FILTERS)[keyof typeof LINK_FILTERS]

export type DeleteLink = (link: Pick<Link, 'shortLink'>) => void
export type UpdateLinkVisibility<T = object> = (
	link: Pick<Link, 'shortLink' | 'isPublic'> & T
) => void
export type EditLink = (link: Pick<Link, 'link' | 'shortLink'>) => void
export type EditShortLink = (
	link: Pick<Link, 'shortLink'> & { newShortLink: Link['shortLink'] }
) => void

export type UserProfileType = Pick<User, '_id' | 'handle' | 'image'> & {
	customLinks: Link[]
	links: Link[]
	linkCount: number
	totalVisits: number
}
