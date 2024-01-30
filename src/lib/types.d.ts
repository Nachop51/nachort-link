export type DBUser = {
	_id: string
	handle?: string
	password: string
	email?: string
}

export type UserInput = Pick<DBUser, 'email' | 'handle' | 'password'>
