import { RANDOM_STRING_LENGTH, VALID_URL_CHARACTERS } from './constants'

export const randomShortLink = () => {
	let result = ''

	for (let i = 0; i < RANDOM_STRING_LENGTH; i++) {
		result += VALID_URL_CHARACTERS.charAt(Math.floor(Math.random() * VALID_URL_CHARACTERS.length))
	}

	return result
}

export function isValidHttpUrl(link: string) {
	let url

	try {
		url = new URL(link)
	} catch (_) {
		return false
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
}
