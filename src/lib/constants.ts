// import { json } from '@sveltejs/kit'

export const DB_NAME = 'nachort'
export const RANDOM_AVATAR_URL = 'https://api.dicebear.com/7.x/pixel-art/svg?seed='

export const RANDOM_STRING_LENGTH = 5
export const VALID_URL_CHARACTERS =
	'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_@'

export const LINKS_COLLECTION = 'links'

export const LINK_FILTERS = {
	ALL: 'All',
	PUBLIC: 'Public',
	PRIVATE: 'Private'
} as const
