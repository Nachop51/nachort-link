export const changeVisibility = async ({
	linkId,
	isPublic
}: {
	linkId: string
	isPublic: boolean
}) => {
	const res = await fetch(`/api/shorten`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ linkId, isPublic })
	})

	return res.ok
}
