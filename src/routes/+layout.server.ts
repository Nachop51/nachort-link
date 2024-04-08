import { getUser } from '$lib/server/user'
// import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = await getUser({ locals })

	// if (user == null) {
	// 	if (url.pathname !== '/') throw redirect(302, '/')
	// } else {
	// 	if (user.handle == null && url.pathname !== '/create-handle') {
	// 		// User is logged in but has no handle
	// 		// Redirect to handle creation page
	// 		throw redirect(302, '/create-handle')
	// 	}
	// }

	return {
		user
	}
}
