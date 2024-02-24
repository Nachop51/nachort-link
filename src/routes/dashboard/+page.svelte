<script lang="ts">
	import type { PageData } from './$types'

	export let data: PageData

	const { links } = data

	$: newLinks = links

	async function handleChange({ _id, isPublic }: { _id: string; isPublic: boolean }) {
		if (!confirm('Are you sure you want to change the visibility of this link?')) return

		try {
			const res = await fetch(`/api/shorten`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ linkId: _id, isPublic: !isPublic })
			})
			if (!res.ok) {
				throw new Error('Failed to update')
			} else {
				newLinks = newLinks.map((link) => {
					if (link._id.toString() === _id) {
						link.isPublic = !isPublic
						return link
					}

					return link
				})
			}
		} catch (e) {
			console.error(e)
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

{#if newLinks.length > 0}
	<h1 class="text-center text-5xl font-semibold my-8">Manage your links</h1>

	<div class="grid gap-4 grid-cols-4 p-8">
		{#each newLinks as { shortLink, link: original, _id, isPublic }}
			<article class="card shadow-xl border border-gray-600 relative">
				<div class="card-body py-6">
					<h3 class="card-title">
						<a class="link" href={shortLink}>{shortLink}</a>
					</h3>
					<p class="overflow-hidden text-ellipsis">{original}</p>

					<div class="card-actions justify-end">
						<label class="flex items-center mt-2">
							<span class="mr-2">Public</span>
							<input
								class="checkbox checkbox-primary"
								type="checkbox"
								on:change={() => handleChange({ _id, isPublic })}
								bind:checked={isPublic}
							/>
						</label>
					</div>
				</div>
				<button
					on:click={async () => {
						await handleDelete({ _id })
					}}
					class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button
				>
			</article>
		{/each}
	</div>
{:else}
	<div class="flex items-center flex-col justify-center min-h-[calc(100vh-132px)]">
		<h1 class="text-5xl font-semibold my-8">You don't have any links yet.</h1>
		<p class="text-lg text-gray-200">Try creating one here using the button below!</p>
		<a href="/" class="btn btn-primary mt-4">Create a link</a>
	</div>
{/if}
