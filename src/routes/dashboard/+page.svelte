<script lang="ts">
	import type { PageData } from './$types'
	import { changeVisibility } from '$lib/services/change_visibility'
	import { page } from '$app/stores'
	import EyeIcon from '$lib/components/icons/eye.svelte'
	import CopyIcon from '$lib/components/icons/copy.svelte'
	import CrossIcon from '$lib/components/icons/cross.svelte'

	export let data: PageData

	const { links } = data

	$: newLinks = links

	async function handleChange({
		_id,
		isPublic,
		e
	}: {
		_id: string
		isPublic: boolean
		e: Event & { currentTarget: HTMLInputElement }
	}) {
		if (!confirm('Are you sure you want to change the visibility of this link?')) {
			if (e.currentTarget?.checked != null) {
				e.currentTarget.checked = isPublic
			}
			return
		}

		if (await changeVisibility({ linkId: _id, isPublic: !isPublic })) {
			newLinks = newLinks.map((link) => {
				if (link._id.toString() === _id) {
					link.isPublic = !isPublic
					return link
				}

				return link
			})
		}
	}

	async function handleDelete({ _id }: { _id: string }) {
		if (!confirm('Are you sure you want to delete this link?')) return

		try {
			const res = await fetch(`/api/shorten`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ linkId: _id })
			})
			if (res.ok) {
				newLinks = newLinks.filter((link) => link._id !== _id)
			} else {
				throw new Error('Failed to delete')
			}
		} catch (e) {
			console.error(e)
		}
	}
</script>

<main class="py-8 px-4">
	{#if newLinks.length > 0}
		<h1 class="text-center text-5xl font-semibold mb-6">Manage your links</h1>

		<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-8">
			{#each newLinks as { shortLink, link: original, _id, isPublic, visits }}
				<article class="card shadow-xl border border-gray-600 relative">
					<div class="card-body py-6">
						<h3 class="card-title text-primary">
							<a target="_blank" rel="noopener noreferrer" class="link" href={shortLink}>
								{shortLink}
							</a>
						</h3>
						<p class="overflow-hidden text-ellipsis">{original}</p>

						<div class="card-actions justify-between items-center mt-2">
							<div class="tooltip tooltip-primary" data-tip="Total visits">
								<span class="flex items-center gap-2">
									<EyeIcon />
									{visits ?? 0}
								</span>
							</div>

							<div class="tooltip tooltip-primary" data-tip="Change the visibility of your link">
								<label class="flex items-center">
									<span class="mr-2">Public</span>
									<input
										class="checkbox checkbox-primary"
										type="checkbox"
										on:change={(e) => handleChange({ e, _id, isPublic })}
										bind:checked={isPublic}
									/>
								</label>
							</div>
						</div>
					</div>

					<div class="flex absolute right-2 top-2">
						<button
							on:click={() => {
								navigator.clipboard.writeText(`${$page.url.origin}/${shortLink}`)
							}}
							class="btn btn-sm btn-circle btn-ghost"
						>
							<CopyIcon className="size-5" />
						</button>
						<button
							on:click={async () => {
								await handleDelete({ _id })
							}}
							class="btn btn-sm btn-circle btn-ghost"
						>
							<CrossIcon className="size-5" />
						</button>
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div
			class="-mt-8 sm:-mt-12 flex items-center flex-col justify-center min-h-[calc(100vh-132px)]"
		>
			<h1 class="text-5xl font-semibold my-8">You don't have any links yet.</h1>
			<p class="text-lg text-neutral-content">Try creating one here using the button below!</p>
			<a href="/" class="btn btn-primary mt-4">Create a link</a>
		</div>
	{/if}
</main>
