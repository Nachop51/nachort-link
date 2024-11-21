<script lang="ts">
	import type { PageData } from './$types'
	import { onDestroy } from 'svelte'

	import { LINK_FILTERS } from '$lib/constants'
	import { createLinkStore, searchHandler } from '$lib/stores/links'
	import ManageLinkList from '$lib/components/manage-link-list.svelte'

	export let data: PageData

	const { links, user } = data

	const linkStore = createLinkStore(links)

	const unsubscribe = linkStore.subscribe((value) => searchHandler(value))

	onDestroy(() => {
		unsubscribe()
	})
</script>

<svelte:head>
	<title>{user.handle}'s Dashboard</title>
</svelte:head>

<main class="px-4">
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
			{#if $linkStore.filtered.length > 0}
				<ManageLinkList
					links={$linkStore.filtered}
					updateLinkVisibility={linkStore.updateVisibility}
					deleteLink={linkStore.deleteShorLink}
					editLink={linkStore.editLink}
					editShortLink={linkStore.editShortLink}
				/>
			{:else}
				<div class="text-center" style="grid-column: 1/-1;">
					<h2 class="text-3xl font-semibold mt-8 mb-3 text-neutral-content">
						Oops there is no links with those filters.
					</h2>
					<p class="text-lg text-neutral-content">Try using another combinations!</p>
					<button class="btn btn-primary mt-4" on:click={linkStore.clearFilters}>
						Reset filters
					</button>
				</div>
			{/if}
		</section>
	{:else}
		<section
			class="-mt-8 sm:-mt-12 flex items-center flex-col justify-center min-h-[calc(100vh-132px)]"
		>
			<h2 class="text-5xl font-semibold my-8">You don't have any links yet.</h2>
			<p class="text-lg text-neutral-content">Try creating one here using the button below!</p>
			<a href="/" class="btn btn-primary mt-4">Create a link</a>
		</section>
	{/if}
</main>
