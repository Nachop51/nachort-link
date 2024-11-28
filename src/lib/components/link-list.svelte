<script lang="ts">
	import type Link from '$lib/server/models/link'
	import EyeIcon from './icons/eye.svelte'

	export let links: Link[]
</script>

{#each links as { shortLink, link, visits }}
	<article
		class="bg-base-300 py-4 px-4 sm:px-6 rounded-lg w-full items-center text-xs sm:text-base"
	>
		<div class="w-[7ch]">
			<a
				class="link link-primary font-bold text-xs sm:text-sm"
				href={shortLink}
				target="_blank"
				rel="noopener noreferrer"
			>
				{shortLink}
			</a>
		</div>
		<div class="divider divider-horizontal mx-0 sm:mx-1"></div>
		<div class="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
			{link}
		</div>
		<div class="divider divider-horizontal mx-1 sm:mx-1"></div>
		<span class="w-8 inline-flex items-center gap-2">
			<div class="flex-1">
				<EyeIcon />
			</div>
			{visits ?? 0}
		</span>
	</article>
{/each}

<style lang="postcss">
	article {
		@apply grid items-center gap-2;
		grid-template-columns: auto auto 1fr auto auto;
	}
</style>
