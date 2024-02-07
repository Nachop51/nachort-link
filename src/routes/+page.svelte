<script lang="ts">
	import { isValidHttpUrl } from '$lib/links'
	import type { LinkType } from '$lib/types'
	import { page } from '$app/stores'

	let link = ''
	let shortenedLink: string | null = null
	let loading = false
	let error: string | null = null

	const handleSubmit = async () => {
		loading = true
		error = null

		if (!isValidHttpUrl(link)) {
			error = 'Invalid URL'
			loading = false
			return
		}

		try {
			const res = await fetch(`/api/shorten/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ link })
			})

			if (res.ok) {
				const data = (await res.json()) as LinkType

				shortenedLink = data.shortLink
			}
		} catch (e) {
			if (!(e instanceof Error)) {
				throw new Error('Failed to create link, please try again later.')
			}

			error = e.message
		}

		loading = false
		link = ''
	}
</script>

<section class="bg-base-200 p-8 text-center rounded-lg">
	<header class="mb-6">
		<h1 class="text-4xl font-bold text-primary">Shorten your link!</h1>
	</header>

	<form on:submit|preventDefault={handleSubmit}>
		{#if error !== null}
			<p class="text-error">{error}</p>
		{/if}
		<input
			class="input input-bordered w-full max-w-xs mb-4"
			type="url"
			bind:value={link}
			class:input-error={error !== null}
			placeholder="https://example.com"
		/>
		<button class="btn bg-base-300" type="submit">Shorten</button>
	</form>
	{#if loading}
		<div class="">
			<span class="loading size-8 mx-auto mt-4"></span>
		</div>
	{/if}
	{#if !loading && error === null && shortenedLink !== null}
		<div class="mt-4" data-sveltekit-preload-data="off">
			<p class="text-success">Your link has been shortened!</p>
			<a class="link link-primary text-lg" href={shortenedLink}
				>Go to &rarr; {`/${shortenedLink}`}</a
			>
			<button
				class="block mt-4 btn btn-accent text-base-100 mx-auto"
				on:click={() => navigator.clipboard.writeText(`${$page.url.href}${shortenedLink}` ?? '')}
			>
				Copy link
			</button>
		</div>
	{:else if !loading && error !== null}
		<p class="text-error">{error}</p>
	{/if}
</section>
