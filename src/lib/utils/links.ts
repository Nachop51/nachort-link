import { RANDOM_STRING_LENGTH, VALID_URL_CHARACTERS } from '../constants'

export const randomShortLink = () => {
	let result = ''

	for (let i = 0; i < RANDOM_STRING_LENGTH; i++) {
		result += VALID_URL_CHARACTERS.charAt(Math.floor(Math.random() * VALID_URL_CHARACTERS.length))
	}

	return result
}

export const isValidShortLink = (shortLink: string) => {
	return (
		shortLink.length > 2 &&
		shortLink.length < 10 &&
		shortLink.split('').every((char) => VALID_URL_CHARACTERS.includes(char))
	)
}

export function isValidHttpUrl(link: unknown): boolean {
	if (typeof link !== 'string') {
		return false
	}

	let url

	try {
		url = new URL(link)
	} catch {
		return false
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
}
