<script lang="ts">
	import ShortLink from '$lib/components/short-link.svelte'
	import LinkIcon from '$lib/components/icons/link.svelte'
	import type { PageServerData } from './$types'

	export let data: PageServerData

	let updateLink: (newLink: string) => string
	let setIsCreatingCustom: () => boolean

	$: ({ user } = data)

	const exampleLinks = ['https://svelte.dev', 'https://tailwindcss.com', 'https://vitejs.dev']
</script>

<main class="min-h-size flex items-center flex-col justify-center px-8">
	<section class="bg-base-100/50 px-8 py-6 text-center rounded-xl border border-neutral/70 mb-4">
		<header class="mb-4">
			<h1 class="text-4xl font-bold text-accent">Shorten your link!</h1>
		</header>

		<ShortLink {user} bind:updateLink bind:setIsCreatingCustom />
	</section>

	<button class="btn btn-sm btn-primary" on:click={() => setIsCreatingCustom()}>
		Toggle custom mode
	</button>

	<section class="mt-8 text-center">
		<header>
			<h2 class="text-lg">Or try to shorten one of the links below:</h2>
		</header>

		<div class="mt-4 flex gap-4 flex-wrap justify-center">
			{#each exampleLinks as exampleLink}
				<button
					class="btn btn-primary text-primary-content"
					on:click={() => {
						updateLink(exampleLink)
					}}
				>
					{exampleLink}
					<LinkIcon />
				</button>
			{/each}
		</div>
	</section>
</main>
