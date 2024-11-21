<script lang="ts">
	import type Link from '$lib/server/models/link'
	import type { DeleteLink, EditLink, EditShortLink, UpdateLinkVisibility } from '$lib/types'
	import ManageLink from './manage-link.svelte'

	export let updateLinkVisibility: UpdateLinkVisibility
	export let deleteLink: DeleteLink
	export let editLink: EditLink
	export let editShortLink: EditShortLink

	export let links: Link[]

	const handleVisibilityChange: UpdateLinkVisibility<{
		e: Event & { currentTarget: HTMLInputElement }
	}> = ({ shortLink, isPublic, e }) => {
		if (!confirm('Are you sure you want to change the visibility of this link?')) {
			if (e.currentTarget.checked != null) {
				e.currentTarget.checked = isPublic
			}
			return
		}

		updateLinkVisibility({ shortLink: shortLink, isPublic: !isPublic })
	}

	const handleDelete: DeleteLink = ({ shortLink }) => {
		if (!confirm('Are you sure you want to delete this link?')) return

		deleteLink({ shortLink })
	}

	const handleLinkEdit: EditLink = ({ link, shortLink }) => {
		editLink({ link, shortLink })
	}

	const handleShortEdit: EditShortLink = ({ shortLink, newShortLink }) => {
		editShortLink({ shortLink, newShortLink })
	}
</script>

{#each links as link}
	<ManageLink {link} {handleVisibilityChange} {handleDelete} {handleLinkEdit} {handleShortEdit} />
{/each}
