export type DBUser = {
	id: string
	handle?: string
	name?: string
	password: string
	email?: string
}

export type UserInput = Pick<DBUser, 'email' | 'handle' | 'password'>

export type Link = {
	id: string
	owner: string
	original: string
	short: string
	public: boolean
}

export type LinkInput = Pick<Link, 'original' | 'short' | 'public'>
