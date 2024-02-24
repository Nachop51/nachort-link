export const getUser = async ({ locals }: { locals: App.Locals }) => {
	const session = await locals.auth()

	if (session == null || session?.user == null) {
		return null
	}

	const user = session.user

	return user
}
