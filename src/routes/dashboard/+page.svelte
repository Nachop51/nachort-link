<script lang="ts">
	import type { PageData } from './$types'
	import { page } from '$app/stores'
	import EyeIcon from '$lib/components/icons/eye.svelte'
	import CopyIcon from '$lib/components/icons/copy.svelte'
	import CrossIcon from '$lib/components/icons/cross.svelte'
	import { Api } from '$lib/services/api'
	import { LINK_FILTERS } from '$lib/constants'
	import { createLinkStore, searchHandler } from '$lib/stores/links'
	import { onDestroy } from 'svelte'

	export let data: PageData

	const { links } = data

	const linkStore = createLinkStore(links)

	async function handleChange({
		shortLink,
		isPublic,
		e
	}: {
		shortLink: string
		isPublic: boolean
		e: Event & { currentTarget: HTMLInputElement }
	}) {
		if (!confirm('Are you sure you want to change the visibility of this link?')) {
			if (e.currentTarget?.checked != null) {
				e.currentTarget.checked = isPublic
			}
			return
		}

		if (await new Api().changeVisibility({ shortLink, isPublic: !isPublic })) {
			linkStore.updateVisibility({ shortLink: shortLink, isPublic: !isPublic })
		}
	}

	async function handleDelete({ shortLink }: { shortLink: string }) {
		if (!confirm('Are you sure you want to delete this link?')) return

		if (await new Api().deleteShortLink({ shortLink })) {
			linkStore.remove({ shortLink })
		}
	}

	const unsubscribe = linkStore.subscribe((value) => searchHandler(value))

	onDestroy(() => {
		unsubscribe()
	})
</script>

<main class="py-8 px-4">
	{#if $linkStore.links.length > 0}
		<h1 class="text-center text-5xl font-semibold mb-10">Manage your links</h1>

		<section class="flex justify-center">
			<div class="join">
				<input
					bind:value={$linkStore.search}
					type="text"
					placeholder="Search for a link..."
					class="input input-bordered input-primary w-full max-w-xs join-item"
				/>
				<select
					class="select select-primary w-min max-w-xs join-item"
					bind:value={$linkStore.filterBy}
				>
					{#each Object.values(LINK_FILTERS) as filter}
						<option value={filter}>{filter}</option>
					{/each}
				</select>
			</div>
		</section>

		<section class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-8">
			{#each $linkStore.filtered as { shortLink, link: original, isPublic, visits }}
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
										on:change={(e) => handleChange({ e, shortLink, isPublic })}
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
								await handleDelete({ shortLink })
							}}
							class="btn btn-sm btn-circle btn-ghost"
						>
							<CrossIcon className="size-5" />
						</button>
					</div>
				</article>
			{:else}
				<div class="text-center" style="grid-column: 1/-1;">
					<h1 class="text-4xl font-semibold my-8 text-neutral-content">
						Oops there is no links with those filters.
					</h1>
					<p class="text-lg text-neutral-content">Try using another combinations!</p>
					<button class="btn btn-primary mt-4" on:click={linkStore.clearFilters}>
						Reset filters
					</button>
				</div>
			{/each}
		</section>
	{:else}
		<section
			class="-mt-8 sm:-mt-12 flex items-center flex-col justify-center min-h-[calc(100vh-132px)]"
		>
			<h1 class="text-5xl font-semibold my-8">You don't have any links yet.</h1>
			<p class="text-lg text-neutral-content">Try creating one here using the button below!</p>
			<a href="/" class="btn btn-primary mt-4">Create a link</a>
		</section>
	{/if}
</main>
