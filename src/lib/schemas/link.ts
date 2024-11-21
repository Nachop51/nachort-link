import { isValidHttpUrl, isValidShortLink } from '$lib/utils/links'
import z from 'zod'

export const linkSchema = z.object({
	link: z
		.string()
		.url()
		.refine(
			(url) => {
				return isValidHttpUrl(url)
			},
			{
				message: 'Invalid URL'
			}
		),
	isPublic: z.boolean().optional().default(true),
	customShortlink: z
		.string()
		.min(2)
		.max(10)
		.refine((shortLink) => isValidShortLink(shortLink), {
			message: 'Invalid shortlink'
		})
		.optional()
})

export function validateLink(data: unknown) {
	return linkSchema.safeParse(data)
}

export function validateLinkInput(data: unknown) {
	return linkSchema.pick({ link: true }).safeParse(data)
}

export function validatePartialLink(data: unknown) {
	return linkSchema.partial().safeParse(data)
}
