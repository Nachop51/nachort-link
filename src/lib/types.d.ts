import type { LINK_FILTERS } from './constants'

export type UserType = {
	id: string
	handle?: string
	name?: string
	password: string
	email?: string
}

export type UserIdType = UserType['id']

export type UserInput = Omit<UserType, 'id' | 'name'>

export type LinkType = {
	_id: string
	ownerId: UserIdType | null
	link: string
	shortLink: string
	isPublic: boolean
	visits?: number
}

export type LinkInput = Omit<Link, 'id' | 'visits'>

export enum THEME {
	LIGHT = 'light',
	DARK = 'dark'
}

export type LinkFilterValues = (typeof LINK_FILTERS)[keyof typeof LINK_FILTERS]
