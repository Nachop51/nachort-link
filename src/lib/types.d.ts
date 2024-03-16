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
	totalVisits: number
}

export type LinkInput = Omit<Link, 'id' | 'totalVisits'>

export enum THEME {
	LIGHT = 'light',
	DARK = 'dark'
}
