<script lang="ts">
	import { RANDOM_AVATAR_URL } from '$lib/constants'
	import LinkList from '../link-list.svelte'
	import LinkIcon from '../icons/link-icon.svelte'
	import EyeIcon from '../icons/eye.svelte'
	import type { UserProfileType } from '$lib/types'

	export let user: UserProfileType

	const userImage = user.image ?? `${RANDOM_AVATAR_URL}${user.handle}.svg`
</script>

<header class="text-center">
	<div class="border-4 border-white mx-auto bg-accent/80 inline-block rounded-full">
		<img
			src={userImage}
			width="200"
			height="200"
			alt={`${user.handle} avatar`}
			class="rounded-full"
		/>
	</div>

	<h1 class="text-3xl sm:text-4xl font-bold mt-2">@{user.handle}</h1>

	<div class="stats bg-transparent mt-4 sm:mt-8 overflow-hidden">
		<div class="stat py-0">
			<div class="stat-title text-neutral-content">Total links</div>
			<div class="stat-value text-accent">
				<span class="inline-flex items-center gap-2">{user.linkCount}<LinkIcon /></span>
			</div>
		</div>

		<div class="stat py-0 border-l-base-content">
			<div class="stat-title text-neutral-content">Link views</div>
			<div class="stat-value text-accent">
				<span class="inline-flex items-center gap-2">
					{user.totalVisits}
					<EyeIcon />
				</span>
			</div>
		</div>

		<div class="stat py-0 border-l-base-content">
			<div class="stat-title text-neutral-content">Custom links</div>
			<div class="stat-value text-accent">
				<span class="inline-flex items-center gap-2">
					{user.customLinks.length}
					<LinkIcon />
				</span>
			</div>
		</div>
	</div>
</header>

<main class="px-4 py-8 max-w-[1200px] mx-auto" data-sveltekit-preload-data="off">
	<div class="sm:px-4">
		{#if user.customLinks.length > 0}
			<h2 class="text-base-content text-xl sm:text-2xl mb-2 sm:mb-4 font-medium">Public links</h2>
			<div class="flex flex-col flex-wrap items-center gap-2 sm:gap-4 mb-4">
				<LinkList links={user.customLinks} />
			</div>
		{/if}
		{#if user.links.length > 0}
			<h2 class="text-base-content text-xl sm:text-2xl mb-2 sm:mb-4 font-medium">Custom links</h2>
			<div class="flex flex-col flex-wrap items-center gap-2 sm:gap-4">
				<LinkList links={user.links} />
			</div>
		{/if}
		{#if user.links.length === 0 && user.customLinks.length === 0}
			<p class="text-center text-lg text-neutral-content">No links found</p>
		{/if}
	</div>
</main>

<style lang="postcss">
	header::before {
		@apply content-[''] absolute w-full -top-[96px] left-0 -z-[2] bg-accent bg-[url('/shapes.png')] bg-cover;
		height: calc(96px + 100px + 4px);
	}

	.stat-value {
		@apply text-2xl sm:text-4xl;
	}

	@media (max-width: 400px) {
		.stats {
			@apply stats-vertical mt-2;
		}
		.stat {
			@apply pt-2 mt-2;
		}
	}
</style>
