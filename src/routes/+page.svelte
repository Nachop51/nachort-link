<script lang="ts">
	import ShortLink from '$lib/components/short-link.svelte'
	import LinkIcon from '$lib/components/icons/link.svelte'
	import type { PageServerData } from './$types'

	export let data: PageServerData

	let updateLink: (newLink: string) => string

	$: ({ user } = data)

	const exampleLinks = ['https://svelte.dev', 'https://tailwindcss.com', 'https://vitejs.dev']
</script>

<svelte:head>
	<title>
		Shorten your link! - {user ? user.handle : 'Guest'}
	</title>
</svelte:head>

<main class="min-h-size flex items-center flex-col px-8">
	<header class="mb-4">
		<h1 class="text-5xl font-bold text-accent mb-3">Shorten your link!</h1>
	</header>

	<section class="max-w-sm w-full">
		<ShortLink {user} bind:updateLink />
	</section>

	<section class="mt-6 text-center">
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
