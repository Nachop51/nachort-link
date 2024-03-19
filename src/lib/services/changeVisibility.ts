export const changeVisibility = async ({
	linkId,
	isPublic
}: {
	linkId: string
	isPublic: boolean
}) => {
	try {
		const res = await fetch(`/api/shorten`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ linkId, isPublic })
		})

		return res.ok
	} catch (error) {
		console.error(error)
		return false
	}
}
