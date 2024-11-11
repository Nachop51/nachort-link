export const RANDOM_AVATAR_URL = 'https://api.dicebear.com/7.x/pixel-art/svg?seed='
export const HASH_SALT_ROUNDS = 12

export const RANDOM_STRING_LENGTH = 5
export const VALID_URL_CHARACTERS =
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_@'

export const CREDENTIALS_ID = 'cred'

export const LINK_FILTERS = {
	ALL: 'All',
	PUBLIC: 'Public',
	PRIVATE: 'Private'
} as const

export const DATA_SERVER_NAMES = {
	USER: 'users',
	USER_LINKS: 'user-links'
}

export const TOAST_DURATIONS = {
	SHORT: 1500,
	NORMAL: 5000,
	LONG: 10000
}

export const MINIMUM_HANDLE_LENGTH = 3
export const MAXIMUM_HANDLE_LENGTH = 20

export const HANDLE_REGEX = new RegExp(
	`^(?=[a-zA-Z0-9._]{${MINIMUM_HANDLE_LENGTH},${MAXIMUM_HANDLE_LENGTH}}$)(?!.*[_.]{2})[^_.].*[^_.]$`
)
