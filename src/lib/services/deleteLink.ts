export const deleteLink = async ({ linkId }: { linkId: string }) => {
	try {
		const res = await fetch(`/api/shorten`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ linkId })
		})

		return res.ok
	} catch (error) {
		console.error(error)
		return false
	}
}
