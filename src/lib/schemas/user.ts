import { HANDLE_REGEX, MAXIMUM_HANDLE_LENGTH, MINIMUM_HANDLE_LENGTH } from '$lib/constants'
import z from 'zod'

export const userSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	handle: z.string().refine((handle) => HANDLE_REGEX.test(handle), {
		message: `Handle must be between ${MINIMUM_HANDLE_LENGTH} and ${MAXIMUM_HANDLE_LENGTH} characters long and can only contain letters, numbers, periods, and underscores`
	}),
	isAdmin: z.boolean().optional().default(false)
})

export function validateSignIn(data: unknown) {
	return userSchema.safeParse(data)
}

export function validateHandle(data: unknown) {
	return userSchema.pick({ handle: true }).safeParse(data)
}

export function validateEmail(data: unknown) {
	return userSchema.pick({ email: true }).safeParse(data)
}

export function validateIsAdmin(data: unknown) {
	return userSchema.pick({ isAdmin: true }).safeParse(data)
}
