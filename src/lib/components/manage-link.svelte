<script lang="ts">
	import { page } from '$app/stores'

	import type Link from '$lib/server/models/link'
	import { copyWithToast } from '$lib/utils/toast'
	import CopyIcon from '$lib/components/icons/copy.svelte'
	import EyeIcon from '$lib/components/icons/eye.svelte'
	import CrossIcon from '$lib/components/icons/cross.svelte'
	import EditIcon from '$lib/components/icons/edit-icon.svelte'
	import type { DeleteLink, EditLink, EditShortLink, UpdateLinkVisibility } from '$lib/types'
	import { isValidShortLink } from '$lib/utils/links'
	import toast from 'svelte-french-toast'
	import { validateLinkInput } from '$lib/schemas/link'

	export let handleVisibilityChange: UpdateLinkVisibility<{
		e: Event & { currentTarget: HTMLInputElement }
	}>
	export let handleDelete: DeleteLink
	export let handleLinkEdit: EditLink
	export let handleShortEdit: EditShortLink

	export let link: Link

	let newLink = link.link
	let newShortLink = link.shortLink

	let isEditingLink = false
	let isEditingShortLink = false
	let inputRef: HTMLInputElement | null = null

	$: if ((isEditingLink && inputRef) || (isEditingShortLink && inputRef)) {
		inputRef.focus()
	}

	function setIsEditingLink(value: boolean) {
		isEditingLink = value
	}

	function setIsEditingShortLink(value: boolean) {
		isEditingShortLink = value
	}

	function handleLinkBlur() {
		if (newLink === link.link) {
			isEditingLink = false
			return
		}

		if (isEditingLink) {
			const result = validateLinkInput({ link: newLink })

			if (result.success && !newLink.includes(' ')) {
				handleLinkEdit({ shortLink: link.shortLink, link: result.data.link })
			} else {
				toast.error('Please enter a valid URL', { duration: 3000 })
				newLink = link.link
			}
		}

		isEditingLink = false
	}

	function handleShortBlur() {
		if (newShortLink === link.shortLink) {
			isEditingShortLink = false
			return
		}
		if (isEditingShortLink) {
			if (isValidShortLink(newShortLink)) {
				handleShortEdit({ shortLink: link.shortLink, newShortLink })
			} else {
				toast.error('Please enter a valid short link', { duration: 3000 })
			}
		}

		isEditingShortLink = false
		newShortLink = link.shortLink
	}
</script>

<article class="card shadow-xl border border-primary relative">
	<div class="card-body py-6">
		<h2 class="card-title text-primary">
			{#if isEditingShortLink}
				<input
					bind:this={inputRef}
					type="text"
					class="input input-primary input-sm w-[10ch]"
					bind:value={newShortLink}
					on:blur={handleShortBlur}
					placeholder="new short"
				/>
			{:else}
				<a target="_blank" rel="noopener noreferrer" class="link" href={link.shortLink}>
					{link.shortLink}
				</a>
			{/if}
		</h2>

		{#if isEditingLink}
			<input
				bind:this={inputRef}
				type="text"
				class="input input-primary input-sm mt-2"
				bind:value={newLink}
				on:blur={handleLinkBlur}
				placeholder="type new link"
			/>
		{:else}
			<p on:dblclick={() => setIsEditingLink(true)} class="overflow-hidden text-ellipsis">
				{link.link}
			</p>
		{/if}

		<!-- Bottom stuff -->
		<div class="card-actions justify-between items-center mt-2">
			<!-- Visits -->
			<div class="tooltip tooltip-primary" data-tip="Total visits">
				<span class="flex items-center gap-2">
					<EyeIcon />
					{link.visits ?? 0}
				</span>
			</div>

			<!-- Link visibility -->
			<div
				class="tooltip tooltip-primary tooltip-left"
				data-tip="Change the visibility of your link"
			>
				<label class="flex items-center">
					<span class="mr-2">Public</span>
					<input
						class="checkbox checkbox-accent"
						type="checkbox"
						on:change={(e) =>
							handleVisibilityChange({ shortLink: link.shortLink, isPublic: link.isPublic, e })}
						bind:checked={link.isPublic}
					/>
				</label>
			</div>
		</div>
	</div>

	<!-- Top right side buttons (Actions) -->
	<div class="flex absolute right-2 top-2">
		<div class="dropdown dropdown-bottom dropdown-end dropdown-hover">
			<div tabindex="0" role="button" class="btn btn-sm btn-circle btn-ghost" title="Edit menu">
				<EditIcon />
			</div>
			<ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-max p-2 shadow">
				<li>
					<button on:click={() => setIsEditingShortLink(true)}>Customize shortlink</button>
				</li>
				<li>
					<button on:click={() => setIsEditingLink(true)}> Edit link </button>
				</li>
			</ul>
		</div>

		<div class="tooltip" data-tip="Copy short link">
			<button
				on:click={() => copyWithToast({ text: `${$page.url.origin}/${link.shortLink}` })}
				class="btn btn-sm btn-circle btn-ghost"
				title="Copy short link"
			>
				<CopyIcon className="size-5" />
			</button>
		</div>

		<div class="tooltip" data-tip="Delete link">
			<button
				on:click={() => handleDelete({ shortLink: link.shortLink })}
				class="btn btn-sm btn-circle btn-ghost"
				title="Delete link"
			>
				<CrossIcon className="size-5" />
			</button>
		</div>
	</div>
</article>
