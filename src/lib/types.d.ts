export type UserType = {
	id: string
	handle?: string
	name?: string
	password: string
	email?: string
}

export type UserId = Pick<UserType, 'id'>

export type UserInput = Pick<UserType, 'email' | 'handle' | 'password'>

export type LinkType = {
	id: string
	ownerId?: UserId
	link: string
	shortLink: string
	isPublic: boolean
}

export type LinkInput = Omit<Link, 'id'>
