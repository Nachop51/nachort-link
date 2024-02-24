export type UserType = {
	id: string
	handle?: string
	name?: string
	password: string
	email?: string
}

export type UserIdType = UserType['id']

export type UserInput = Pick<UserType, 'email' | 'handle' | 'password'>

export type LinkType = {
	_id: string
	ownerId: UserIdType | null
	link: string
	shortLink: string
	isPublic: boolean
}

export type LinkInput = Omit<Link, 'id'>
