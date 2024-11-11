import { isValidHttpUrl, isValidShortLink } from '$lib/utils/links'
import z from 'zod'

export const linkSchema = z.object({
	link: z
		.string()
		.url()
		.refine((url) => isValidHttpUrl(url), {
			message: 'Invalid URL'
		}),
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
